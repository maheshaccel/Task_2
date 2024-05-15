import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

export const upload = multer({ storage: storage , limits : {
  fileSize : 1024 * 24 * 24
} ,fileFilter:(req , file , cb)=>{
 const fileTypes = /jpeg|jpg|png|gif/
 const mimtype = fileTypes.test(file.mimetype)
 const extname = fileTypes.test(path.extname(file.originalname))


 

 if(mimtype && extname) return cb(null, true)
  
  // @ts-ignore
  cb('Give proper file format')

} })