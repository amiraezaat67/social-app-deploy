import { nanoid } from "nanoid"
import { cloudinary } from "../../../config/cloudinary.config.js"
import { Friends, Requests, User } from "../../../DB/models/index.js"

export const uploadProfilePicture = async (req, res, next) => {
    const {_id} = req.loggedInUser
    const {file} = req
    if(!file) return res.status(400).json({ message: 'Please upload a profile picture' })

    await User.findByIdAndUpdate(_id, {profilePicture: file.path})

    return res.status(200).json({ message: 'Profile picture uploaded successfully' })
}


export const uploadCoverPictures = async (req, res, next) => {
    const {_id} = req.loggedInUser
    const {files} = req
    if(!files?.length) return res.status(400).json({ message: 'Please upload a cover picture' })

    const coverPictures =  files.map(file=>file.path)    

    await User.findByIdAndUpdate(_id, {coverPictures})
   
    return res.status(200).json({ message: 'Cover pictures uploaded successfully' })
}


export const updateProfilePictureCloud = async (req, res, next) => {
    const {_id} = req.loggedInUser
    const {file} = req
    if(!file) return res.status(400).json({ message: 'Please upload a profile picture' })


    // upload
    const folderId = nanoid(4)
    const {secure_url, public_id} = await cloudinary().uploader.upload(file.path,{
        folder:`${process.env.CLOUDINARY_FOLDER}/Users/Profile/${folderId}`,
        resource_type:'image',
    })

    const user = await User.findByIdAndUpdate(_id,
         {
            profilePicture:{secure_url, public_id, folderId}
        }
    )
    res.status(200).json({ message: 'Profile picture uploaded successfully', user})

}




export const uploadCoverCloudPictures = async (req, res, next) => {
    const {_id} = req.loggedInUser
    const {files} = req
    if(!files?.length) return res.status(400).json({ message: 'Please upload a cover picture' })

    const folderId = nanoid(4)
    const Urls = []

   for (const file of files) {
        const {secure_url, public_id} = await cloudinary().uploader.upload(file.path,{
            folder:`${process.env.CLOUDINARY_FOLDER}/Users/Covers/${folderId}`,
            resource_type:'image',
        })
        Urls.push({secure_url, public_id})
    }

    const user = await User.findByIdAndUpdate(
        _id,
        {
            coverPictures:{urls: Urls , folderId}
        }
    )
    
    return res.status(200).json({ message: 'Cover pictures uploaded successfully'  , user})
}



export const deleteAccount = async (req, res, next) => {
    const user  = await User.findByIdAndDelete(req.loggedInUser._id)

    return res.status(200).json({ message: 'Account deleted successfully'  , user})
}


// Send Request
export const SendRequestService = async (req, res, next) => {
    const {_id} = req.loggedInUser   // requestedById  => amira 
    const {requestToId} = req.params   // requestedToId  => yasir
    
    const user = await User.findById(requestToId)
    if(!user) return res.status(404).json({ message: 'User not found' })


    const isDocumentExists = await Requests.findOne({requestedBy:_id})
    if(isDocumentExists){
        await Requests.updateOne({requestedBy:_id},{$addToSet:{pendings:requestToId}})
    }else{
        const newDoc = new Requests({   
            requestedBy:_id,
            pendings:[requestToId]
        })

        await newDoc.save()
    }

    return res.status(200).json({ message: 'Request sent successfully'  })
}



export const AcceptRequestService = async (req, res, next) => {
    const {_id} = req.loggedInUser   // Yasir
    const {requestFromId} = req.params   // Amira


    await Requests.findOneAndUpdate({
        requestedBy:requestFromId,
        pendings:{$in:[_id]}
        },{
            $pull:{pendings:_id}
        }
    )


    const isDocumentExists = await Friends.findOne({userId:_id})
    if(isDocumentExists){
        await Friends.updateOne({userId:_id},{$addToSet:{friends:requestFromId}})
    }else{
        const newDoc = new Friends({   
            userId:_id,
            friends:[requestFromId]
        })

        await newDoc.save()
    }

    return res.status(200).json({ message: 'Request accepted successfully'  })
}

export const listFriendsService = async (req, res, next) => {
    const {_id,username} = req.loggedInUser

    const friends = await Friends.findOne({userId:_id}).populate(
        [
            {
                path:'friends',
                select:'username'
            }
        ]
    ).select('-_id -userId')

    return res.status(200).json({ message: 'Request accepted successfully'  , data:friends.friends, user:{_id, username} })
}