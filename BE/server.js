// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';


dotenv.config();
const app = express();
const PORT = process.env.PORT ;
//clodinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY});


import authRoute from "./routes/auth.rout.js";
import connectDB from "./db/connectDB.js";
import userRoute from "./routes/user.router.js";
import postRoute from "./routes/post.route.js";




app.use(express.json());
app.use(cookieParser());//middleware to parse cookies from incoming requests

app.use("/api/auth",authRoute);
app.use("/api/users",userRoute); 
app.use("/api/posts",postRoute);





app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

