import mongoose from "mongoose";


const ConnectDB = (app : any)=>{
  mongoose.connect( 
    "mongodb://localhost:27017/", 
    { 
      dbName: "task-2", 
    }, 
  ).then(()=>{
    app.listen(4000, ()=>{
      console.log("server is runnning on port 4000...")
    })
  })
}


export default ConnectDB