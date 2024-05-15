import { NextFunction, Request, Response } from "express"
import  JWT  from "jsonwebtoken"
import { ApiError } from "../utils/Errorhandler"
import CatchAsync from "../utils/CatchAsync"
import UserModel from "../model/UserModel"

export const Authentication= CatchAsync(async(req :Request , res :Response , next : NextFunction)=>{
  const token = req.headers.authorization

  if(!token) return next(ApiError(404, 'Please login or signup before accesing this route'))

  const authToken = token.split(' ')[1]
  const decode = JWT.verify(authToken , "mahesh")

  if(!decode) return next(ApiError(400, "User is not valid"))
 
   // @ts-ignore
  const user = await UserModel.findById(decode.id)

  if(!user) return next(ApiError(404, "Please login or signup before accesing this route"))
  // @ts-ignore
  req.user = user?._id

  next() 
})