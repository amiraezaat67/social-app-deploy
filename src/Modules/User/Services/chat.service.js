import { Chat } from "../../../DB/models/index.js"
import { authenticationMiddleware } from "../../../Middleware/authentication.middleware.js"
import { socketConnections } from "../../../utils/socket.utils.js"



export const GetChatHistoryService = async (req, res, next) => {
    const {_id} = req.loggedInUser
    const {receiverId} = req.params

    const chat = await Chat.findOne({
        $or:[
             {senderId:_id, receiverId},
            {senderId:receiverId, receiverId:_id}
        ]
    }).populate(
        [
            {path:'senderId' , select:'username'},
            {path:'receiverId' , select:'username'},
            {path:'messages.senderId' , select:'username'}
         ]
    )

    return res.status(200).json({ message: 'Chat history fetched successfully'  , chat})
}



export const SendeChatMessage = async (socket)=>{
    return socket.on('sendMessage', async (data)=>{
        const {_id} = await authenticationMiddleware(socket.handshake.auth.accesstoken) 
        const {body, receiverId} = data  

        let chat = await Chat.findOneAndUpdate({
            $or:[
                {senderId:_id, receiverId},
               { senderId:receiverId, receiverId:_id}
           ]
        },{
            $addToSet:{
                messages:{
                    body,
                    senderId:_id
                }
            }
        }
        )

        if(!chat) {
            const newChat= new Chat({
                senderId:_id,
                receiverId,
                messages:[{
                    body,
                    senderId:_id
                }]
            })
            chat =  await newChat.save()
        }

        socket.emit('successMessage', {body , chat})

        const socketId = socketConnections.get(receiverId.toString())
        socket.to(socketId).emit('receiveMessage', {body})
    })
}