
import {Router} from 'express'
import * as reactService from './Service/react.service.js'
import { authenticationMiddleware } from '../../Middleware/authentication.middleware.js'
import { errorHandler } from '../../Middleware/error-handler.middleware.js'
const reactController = Router()



reactController.post(
    '/add',
    authenticationMiddleware(),
    errorHandler(reactService.AddReact)
)

reactController.delete(
    '/delete',
    authenticationMiddleware(),
    errorHandler(reactService.deleteReact)
)
export {reactController}