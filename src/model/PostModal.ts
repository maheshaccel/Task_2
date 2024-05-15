import mongoose from "mongoose";


const PostModal = new mongoose.Schema({
  title :{
    type : String,
    required : true
  },
  category :{
    type : mongoose.SchemaTypes.ObjectId,
    required : true,
    ref : 'category'
    },
  content :{
    type : String,
    required : true
  },
  user :{
    type : mongoose.SchemaTypes.ObjectId,
    required : true,
    ref : 'user'
  },
  last_modify_date :{
    type : Date,
    default : null
  },
  post_date :{
    type : Date,
    required : true,
    default : Date.now()
  },
  created_at : {
    type: Date,
    default : Date.now()
  },
  file : [{
    type : String
  }]
})


export =  mongoose.model('post', PostModal )