import express from "express";
import colors from "colours";
import dotenv from 'dotenv'
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoute.js';
import productRoutes from './routes/productRoutes.js';
import fileUpload from 'express-fileupload';
import cors from "cors";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

//configure env

dotenv.config();

connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app=express();
app.use(fileUpload());
app.use(cors());
app.use(express.json())


app.use(morgan('dev'))
//routes

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoutes);

app.get('/',(req,res)=>{
    res.send(
       '<h1>WELCOME TO ECOMMERCE APP</h1>'
    )
})
const PORT=process.env.PORT||8080;
app.listen(PORT,()=>{
    console.log(`SERVER RUNNING on ${process.env.DEV_MODE} mode on port ${PORT}`);
});
