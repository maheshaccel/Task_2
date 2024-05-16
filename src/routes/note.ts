import express from 'express'
import { Authentication } from '../middleware/auth'
import { CreateNote, DeleteNote, GetAllNote, GetNote, UpdateNote } from '../controllers/UserNoteController'

const router = express.Router()


router.post('/create',Authentication, CreateNote )
router.get('/getnote/:id', Authentication ,  GetNote )
router.get('/getall', Authentication ,  GetAllNote )
router.put('/update/:id',Authentication , UpdateNote)
router.delete('/delete/:id', Authentication, DeleteNote)


export default router