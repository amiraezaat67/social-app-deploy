import mongoose from "mongoose";


const friendsSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
}, {timestamps:true})

const Friends = mongoose.models.Friends || mongoose.model('Friends', friendsSchema)

export  {Friends}