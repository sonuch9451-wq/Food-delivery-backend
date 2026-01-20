import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoutes.js';
import userRouter from './routes/userRoutes.js';
import "dotenv/config"
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import jwt from 'jsonwebtoken';

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
    res.status(200).send("API is Working - Updated Version")
})

app.get('/test-jwt', async (req,res) =>{
    try {
        const testToken = jwt.sign({id: 'test123'}, process.env.JWT_SECRET);
        const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
        res.json({
            success: true, 
            message: 'JWT working correctly',
            testToken,
            decoded,
            jwtSecret: process.env.JWT_SECRET
        });
    } catch (error) {
        res.json({success: false, error: error.message});
    }
})


// Listen

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
    console.log('🔑 JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');
    console.log('🔑 JWT_SECRET value:', process.env.JWT_SECRET);
})














//mongodb+srv://sc763894_db_user:<db_password>@cluster0.wsaajkl.mongodb.net/?appName=Cluster0