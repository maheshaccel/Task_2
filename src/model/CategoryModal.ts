import mongoose from "mongoose";


const CategoryModal = new mongoose.Schema({
  categoryName  : {
    type : String,
    required : true
  }
})


export =  mongoose.model('category', CategoryModal )