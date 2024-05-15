import JWT from 'jsonwebtoken'
import { Types } from 'mongoose'

const CreateToken = ({id , name} : { id : Types.ObjectId , name : string})=>{
    return JWT.sign( { id , name} , "mahesh")
}



export  { CreateToken }