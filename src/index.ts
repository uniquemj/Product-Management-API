import express from 'express'
import mongoose, { mongo } from 'mongoose'
import 'dotenv/config'
import cookieParser from "cookie-parser"
import apiRoute from './routes/index'
import errorHandler from './middlewares/errorhandler.middleware'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api', apiRoute)

app.use(errorHandler)

const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGODB_URL as string

app.listen(PORT, async()=>{
    console.log(`Server Running at: ${PORT}`)
    try{
        await mongoose.connect(MONGODB_URL)
        console.log("Connected to Database . . .")
    } catch(e){
        console.log("Error: Connection Failed...")
    }
})