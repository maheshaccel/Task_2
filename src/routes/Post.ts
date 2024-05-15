import express from 'express'
import { CreatePost, DeletePost, GetAllPost, GetPostByID, GetUserPost, UpdatePost } from '../controllers/PostController'
import { Authentication } from '../middleware/auth'
import { upload } from '../middleware/multer'

const router = express.Router()


router.post('/create', Authentication, upload.array('file') ,CreatePost)
router.put('/update/:id',Authentication,upload.array('file'), UpdatePost )
router.delete('/delete/:id',Authentication, DeletePost )
router.get('/getall', GetAllPost )
router.get('/getpost/:id', GetPostByID )
router.get('/getmypost',Authentication, GetUserPost )


export default router