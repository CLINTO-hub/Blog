import express from 'express'
import dotenv from 'dotenv'
import http from 'http'
import cors from 'cors'
import ConnectDB from './Database/ConnectDB.js'
import cookieParser from 'cookie-parser'
import UserRoute from '../Backend/Routes/UserRoute.js'
import BlogRoute from '../Backend/Routes/BlogRoute.js'
import bodyParser from 'body-parser'

dotenv.config()
const PORT = process.env.PORT || 5000;

const app = express()
const server = http.createServer(app)

const corsOptions = {
    origin: true,
    credentials: true,
  };
app.get('/',(req,res)=>{
    res.send('Hello world');
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/auth',UserRoute)
app.use('/blog',BlogRoute)

server.listen(PORT,()=>{
    ConnectDB()
    console.log(`Server started on port ${PORT}`);
})