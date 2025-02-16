
import cors from 'cors'
import helmet from 'helmet'
import { customRateLimiter, globalErrorHandler } from '../Middleware/index.js'
import * as controllers from  '../Modules/index.js'
import { corsOptions } from '../config/cors.config.js'

const controllerHandler = async (app, express) =>{

    // Get the static files
    // app.use('/Assets', express.static('Assets'))
    
    // cors options
    app.use(cors(corsOptions))

    // Rate Limiter
    // app.set('trust proxy', 'loopback')
    // app.use(customRateLimiter)

    // Helmet
    // app.use(helmet())

    // Routers
    app.use('/auth', controllers.authRouter)
    app.use('/user', controllers.userController)
    app.use('/post' , controllers.postController)
    app.use('/comments' , controllers.commentController)
    app.use('/react' , controllers.reactController)
    
    // Main Router
    app.get('/', async (req, res) => res.status(200).json({ message: 'Social App server is running'}))
    
    // Handle not found routers
    app.all('*', (req, res) => res.status(404).json({ message: 'Route not found please make sure from your url and your method' }) )
    
    // global error handler
    app.use(globalErrorHandler)

}

export  {controllerHandler}

