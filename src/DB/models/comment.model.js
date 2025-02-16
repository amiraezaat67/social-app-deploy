import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
   content: String,
   ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
   tags:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
   images:{
        URLS:[{
            secure_url:String,
            public_id:String
        }],
        folderId:String
    },
    commentOnId: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel', required: true},
    onModel:{
        type:String,
        enum:['Post', 'Comment']
    }

},{timestamps:true})


const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)

export  {Comment}