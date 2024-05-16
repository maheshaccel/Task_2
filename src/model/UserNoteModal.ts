import mongoose from "mongoose";

//user , _id , created_at, modify_date , Note_file
const UserNoteModal = new mongoose.Schema({
  user:{
    type : mongoose.SchemaTypes.ObjectId,
    ref:'user',
    required : true
  },
  modify_date :{
    type: Date,
    default : null
  },
  created_at : {
    type: Date,
    default : Date.now()
  },
  file : {
    type:String,
    required:true
  }
})


export =  mongoose.model('note', UserNoteModal )