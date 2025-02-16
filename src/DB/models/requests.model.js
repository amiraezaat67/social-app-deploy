
import mongoose from "mongoose";
const requestsSchema = new mongoose.Schema({
    requestedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    pendings: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
}, {timestamps:true})

const Requests = mongoose.models.Requests || mongoose.model('Requests', requestsSchema)

export  {Requests}