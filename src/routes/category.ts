import express from 'express'
import { Authentication } from '../middleware/auth'
import { CreateCategory, DeleteCategory, GetAllCategory, UpdateCategory } from '../controllers/CategoryController'

const router = express.Router()


router.post('/create', Authentication, CreateCategory)
router.put('/update/:id',Authentication, UpdateCategory )
router.delete('/delete/:id',Authentication, DeleteCategory )
router.get('/getall', GetAllCategory )


export default router