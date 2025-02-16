import mongoose from "mongoose";
import { hashSync } from "bcrypt";
import { genderEnum, ProvidersEnum, systemRoles } from "../../constants/constants.js";
import { Decryption, Encryption } from "../../utils/crypto.utils.js";
import { cloudinary } from "../../config/cloudinary.config.js";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true,'username is required'],
        lowercase: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: 'idx_email_unique'
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone:String,
    isDeactived: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profilePicture:{
        secure_url:String,
        public_id:String,
        folderId:String
    },
    coverPictures:{
        urls:[{
            secure_url:String,
            public_id:String,
        }],
        folderId:String
    },
    confirmOtp:String,
    forgetOtp:String,
    role:{
        type: String,
        default: systemRoles.USER,
        enum: Object.values(systemRoles)
    },
    isPublic:{
        type: Boolean,
        default: true
    },
    DOB:Date,
    gender:{
        type: String,
        enum:Object.values(genderEnum),
        default: genderEnum.NOT_SPECIFIED
    },
    provider:{
        type: String,
        default:ProvidersEnum.SYSTEM,
        enum: Object.values(ProvidersEnum)
    },
},{
    timestamps: true
})

//================================ Document middleware ===============================//
userSchema.pre('save', async function(){

    const changes=  this.getChanges()['$set'];
    if(changes.password){
        this.password = hashSync(this.password , +process.env.SALT_ROUNDS)
    }
    if(changes.phone){
        this.phone = await Encryption({value:this.phone, secret:process.env.ENCRYPTION_SECRET_KEY  })
    }
    
})

//==================================== Query Middleware ============================//
userSchema.post(['find','findOneAndUpdate' , 'findOne'], async function(result){
    console.log('Result in user schema', result);
    
    if(result){
        if(this.op == 'find'){
            result.map(async(user)=>{
                if(user.phone) user.phone = await Decryption({value:user.phone, secret:process.env.ENCRYPTION_SECRET_KEY  })
                return user
            })
        }else{
            if(result.phone) result.phone = await Decryption({value:result.phone, secret:process.env.ENCRYPTION_SECRET_KEY  })
        }
    }
})


// Delete profile folder and cover folder from cloudinary
userSchema.post(['findOneAndDelete','deleteOne'], async function(result){
    
    const profileFolder = result.profilePicture?.folderId
    const coverFolder = result.coverPictures?.folderId

    if(profileFolder){
        await cloudinary().api.delete_resources_by_prefix(`${process.env.CLOUDINARY_FOLDER}/Users/Profiles/${profileFolder}`)
        await cloudinary().api.delete_folder(`${process.env.CLOUDINARY_FOLDER}/Users/Profiles/${profileFolder}`)
    }

    if(coverFolder){
        await cloudinary().api.delete_resources_by_prefix(`${process.env.CLOUDINARY_FOLDER}/Users/Covers/${coverFolder}`)
        await cloudinary().api.delete_folder(`${process.env.CLOUDINARY_FOLDER}/Users/Covers/${coverFolder}`)
    }
})


const User = mongoose.models.User || mongoose.model('User',userSchema)

export {User}
