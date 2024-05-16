import JWT from 'jsonwebtoken'
import { Types } from 'mongoose'
import fs from 'fs'

const CreateToken = ({id , name} : { id : Types.ObjectId , name : string})=>{
    return JWT.sign( { id , name} , "mahesh")
}

const RemoveFolder = (folderPath : string)=>{
    fs.rm(folderPath, { recursive: true }, (err) => {
        if (err) {
          console.error("Error removing folder:", err);
          return;
        }
        console.log("Folder removed successfully");
      });
}


export  { CreateToken , RemoveFolder }