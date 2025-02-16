import { authenticationMiddleware } from "../Middleware/index.js"
import { SendeChatMessage } from "../Modules/User/Services/chat.service.js"



export const socketConnections = new Map()

export const registerSocketId = async (handshake  , id)=>{
    // get loggedIn User data
    const accesstoken = handshake.auth.accesstoken
    // verify token
    const user = await authenticationMiddleware(accesstoken)
      
    // store socketId
    socketConnections.set(user?._id?.toString(),id)

    console.log('Socket connected' , user?._id?.toString());

    return 'Socket connected successfully'
    
}


export const removeSocketId = async(socket)=>{
   return socket.on('disconnect',async()=>{
        // get loggedIn User data
        const accesstoken = socket.handshake.auth.accesstoken
        // verify token
        const user = await authenticationMiddleware(accesstoken)

        socketConnections.delete(user?._id?.toString())

        console.log('Socket disconnected' , user?._id?.toString());

        return 'Socket disconnected successfully'
   })
}


export const establishIoConnection = (io)=>{
    return io.on('connection',async(socket)=>{
        
        // register socketId
        await registerSocketId(socket.handshake,socket.id)


        // send message
        await SendeChatMessage(socket)

        await removeSocketId(socket)
        console.log('Socket disconnected' ,socketConnections);
        
    })
}

