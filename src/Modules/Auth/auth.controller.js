

import  { Router} from 'express'
import * as AuthServices from './Services/authentication.service.js'
import { errorHandler } from '../../Middleware/error-handler.middleware.js'

const authRouter = Router()

authRouter.post('/register' , errorHandler(AuthServices.registerService) )
authRouter.put('/confirm-email' , errorHandler(AuthServices.ConfirmEmailService) )
authRouter.post('/login' , errorHandler(AuthServices.loginService) )

authRouter.post('/gmail-login' , errorHandler(AuthServices.GmailLoginService) )
authRouter.post('/gmail-signUp' , errorHandler(AuthServices.GmailRegistrationService) )
export  {authRouter}
