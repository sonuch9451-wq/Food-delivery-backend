import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoutes.js';
import userRouter from './routes/userRoutes.js';
import "dotenv/config"
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';

// App Config

const app = express();
const port = 4000

// Middlewares

app.use(express.json())
app.use(cors())

// DB connection
connectDB();

// API endpoints

app.use('/api/food',foodRouter);
app.use('/images',express.static('uploads'))
app.use('/api/user',userRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/', async (req,res) =>{
    res.status(200).send("NEW SERVER RUNNING - UPDATED VERSION")
})

// Listen

app.listen(port, ()=>{
    console.log(`NEW SERVER Started on http://localhost:${port}`)
})