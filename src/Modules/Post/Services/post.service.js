import { Post, User } from "../../../DB/models/index.js"
import { pagination } from "../../../utils/pagination.utils.js"


export const createPost = async (req, res, next) => {
    const {_id} = req.loggedInUser
    const { title , desc  , allowedComments  , tags} = req.body
    const {files} = req

    if(tags){
        const users  = await User.find({ _id:{ $in: tags}})
        if(users.length != tags.length){
            return res.status(404).json({ message: 'User not found' })
        }
    }

    const postObject =  {
        title,
        description:desc,
        ownerId:_id,
        allowedComments,
        tags
    }

    const post = await Post.create(postObject)

    return res.status(200).json({ message: 'Post created successfully'  , post})
}


export const listPosts = async (req, res, next) => {
    const {page , limit} = req.query

    // ======================= Pagination ======================= //
    // const {skip , limit:calculatedLimit} = pagination(page , limit)

    // const posts = await Post.find().limit(calculatedLimit).skip(skip).sort({createdAt: -1})
    // const allPosts = await Post.countDocuments({allowedComments:false})

    // ======================= Pagination ======================= //
    const posts  = await Post.paginate(
        { allowedComments: false}, 
        {
          limit,
          page,
          sort: { createdAt: -1 },
          populate: [
            {
              path: "ownerId",
              select: "username phone",
            },
          ],
          customLabels: {
            totalDocs: 'totalPosts',
            docs: 'posts',
            limit:'documentPerPage',
            page:'currentPage'
          }
        } 
    )

    return res.status(200).json({ message: 'Posts fetched successfully'  , posts })

}

/**
 * MongoDB hosted 
 * package.json
 * github 
 * host
 */