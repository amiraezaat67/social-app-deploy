import { Comment, Post, User } from "../../../DB/models/index.js"

export const addCommentService = async (req, res, next) => {
    const {_id} = req.loggedInUser
    const { onModel, content , tags} =req.body
    const {commentOnId}  = req.params   // postId or commentId

    if(onModel == 'Post'){
        const post  = await Post.findOne({_id:commentOnId , allowedComments:true})
        if(!post) return res.status(404).json({ message: 'Post not found' })
    }else if(onModel == 'Comment'){
        const comment  = await Comment.findById(commentOnId)
        if(!comment) return res.status(404).json({ message: 'Comment not found' })
    }


    if(tags){
        const users  = await User.find({ _id:{ $in: tags}})
        if(users.length != tags.length){
            return res.status(404).json({ message: 'User not found' })
        }
    }

   // upload

    const commentObject  ={
        content,
        ownerId:_id,
        tags,
        onModel,
        commentOnId
    }

    const newComment  = await Comment.create(commentObject)

    return res.status(200).json({ message: 'Comment added successfully'  , newComment})
}


export const listComments = async (req, res, next) => {
    const comments = await Comment.find({})
    .populate(
        [
            {
                path:'commentOnId',
                match:{title: "post1"},
                // nested populate
                populate:[{
                    path:'ownerId',
                    select:'username'
                }]
            },
            {
                path:'ownerId',
                select:'username'
            }
        ]
    ).select('content ownerId commentOnId  onModel -_id')

    return res.status(200).json({ message: 'Comments fetched successfully'  , comments})
}