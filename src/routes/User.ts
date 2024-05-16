import express from 'express'
import { CreateUser, DeleteUser, DeleteUserByID, GetAllUser, UpdateUser, getUserDetails } from '../controllers/UserController'
import { Authentication } from '../middleware/auth'
import { UserUpload, upload } from '../middleware/multer'

const router = express.Router()


router.post('/create', UserUpload.single('avtar') , CreateUser )
router.get('/getalluser', GetAllUser )
router.get('/me', Authentication, getUserDetails)
router.put('/update',Authentication ,UserUpload.single('avtar'), UpdateUser)
router.delete('/delete', Authentication, DeleteUser)
router.delete('/delete/:id', Authentication, DeleteUserByID)


export default router