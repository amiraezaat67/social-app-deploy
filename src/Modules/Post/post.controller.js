

import {Router} from 'express'
import * as postServices from './Services/post.service.js'
import { authenticationMiddleware , errorHandler } from '../../Middleware/index.js'

const postController = Router()


postController.post('/add', 
    authenticationMiddleware(),
    errorHandler(postServices.createPost)
)

postController.get('/list', errorHandler(postServices.listPosts) )

export {postController}