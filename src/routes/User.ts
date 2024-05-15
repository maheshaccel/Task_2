import express from 'express'
import { CreateUser, DeleteUser, DeleteUserByID, GetAllUser, UpdateUser, getUserDetails } from '../controllers/UserController'
import { Authentication } from '../middleware/auth'

const router = express.Router()


router.post('/create', CreateUser )
router.get('/getalluser', GetAllUser )
router.get('/me', Authentication, getUserDetails)
router.put('/update',Authentication , UpdateUser)
router.delete('/delete', Authentication, DeleteUser)
router.delete('/delete/:id', Authentication, DeleteUserByID)


export default router