import { Reacts } from "../../constants/constants.js";
import mongoose from "mongoose";

const reactSchema = new mongoose.Schema({
   reactOnId: {type: mongoose.Schema.Types.ObjectId, refPath: 'onModel', required: true},
   onModel:{
       type:String,
       enum:['Post','Comment']
   },
   ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
   reactType:{  // TODO:  Can be into seperated model
       type:String,
       enum: Object.values(Reacts)
   }
}, {timestamps: true})


const React = mongoose.models.React || mongoose.model('React', reactSchema)

export  {React}