import { Post, React } from "../../../DB/models/index.js"

export const AddReact = async (req, res, next) => {
    const {_id} = req.loggedInUser
    const {reactOnId, reactType , onModel} = req.body
    
    if(onModel == 'Post'){
        const post  = await Post.findById(reactOnId)
        if(!post) return res.status(404).json({ message: 'Post not found' })
    }else if(onModel == 'Comment'){
        const comment  = await Comment.findById(reactOnId)
        if(!comment) return res.status(404).json({ message: 'Comment not found' })
    }

    const isReactExists = await React.findOne({reactOnId, onModel, ownerId:_id})
    if(isReactExists) {
        isReactExists.reactType = reactType
        await isReactExists.save()
        return res.status(200).json({ message: 'React updated successfully'  , isReactExists})
    }

    const reactObject = {
        reactOnId,
        onModel,
        ownerId:_id,
        reactType
    }

    const react = await React.create(reactObject)

    return res.status(200).json({ message: 'React created successfully'  , react})

}  

export const deleteReact = async (req, res, next) => {
    // TODO: can be changed to be with reactId direct
    const {_id} = req.loggedInUser
    const {reactOnId, reactType} = req.body

    const react = await React.findOneAndDelete({reactOnId, reactType, ownerId:_id})
    if(!react) return res.status(404).json({ message: 'React not found' })

    return res.status(200).json({ message: 'React Deleted successfully'  , react})

}  
// List reacts