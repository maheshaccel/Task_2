import express from 'express'
import UserRouter from './User'
import PostRouter from './Post'
import CategoryRouter from './category'
import NoteRouter from './note'


const router = express.Router()


router.use('/user' , UserRouter)
router.use('/post' , PostRouter)
router.use('/category' , CategoryRouter)
router.use('/note' , NoteRouter)




export default router