import express from 'express'
import cors from 'cors'
import mainRouter from './routes/index'
import ConnectDB from './config/db'
import { errors } from './utils/error'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use('/api/v1' , mainRouter)


app.use(errors)
ConnectDB(app)

