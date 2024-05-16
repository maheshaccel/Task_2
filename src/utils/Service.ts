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


const generateRandomFileName =(length : number)=> {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomFileName = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomFileName += characters.charAt(randomIndex);
  }
  return randomFileName;
}



export  { CreateToken , RemoveFolder , generateRandomFileName }