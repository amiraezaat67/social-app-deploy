

import {Router} from 'express'
import * as commentService from './Services/comment.service.js'
import { authenticationMiddleware , errorHandler } from '../../Middleware/index.js'
const commentController = Router()


commentController.post(
    '/add/:commentOnId', 
    authenticationMiddleware(), 
    errorHandler(commentService.addCommentService) 
)

commentController.get(
    '/list',
    errorHandler(commentService.listComments)
)

export {commentController}