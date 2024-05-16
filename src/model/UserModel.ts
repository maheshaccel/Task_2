import mongoose from "mongoose";
import validator from "validator";

const UserModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique : true,
    validate: {
      validator: function (v: string) {
        return validator.isEmail(v);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid email address!`,
    },
  },
  password : {
    type : String,
    required : true
  },
  status : {
    type : String,
    default : "active",
    enum : ['active', 'inactive']
  },
  avtar : {
    type: String,
    default : null
  }
});




export = mongoose.model('user', UserModel)