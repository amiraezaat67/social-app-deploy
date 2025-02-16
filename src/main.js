
import express from 'express'
import { config } from 'dotenv'
import { Server } from 'socket.io'
import {database_connection} from './DB/connection.js'
import { controllerHandler } from './utils/index.js'
config()
import { establishIoConnection } from './utils/socket.utils.js'



const bootstrap = async () => {
  const app = express()
  
  const port = process.env.PORT || 3000
  app.use(express.json())

  // Handel all project controllers
  controllerHandler(app,express)

  database_connection()
  
 const server = app.listen(port, () => {
    console.log('Social App server is running on port ' , port)
  })    

  // SocketIo Establish connection
  const io = new Server(server, {
    cors:{
      origin:'*'
    }
  })
  establishIoConnection(io)
  
}


export default bootstrap


