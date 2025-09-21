// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import cors from 'cors';


dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow cookies to be sent 
}));
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
import notificationRoute from "./routes/notification.route.js";




app.use(express.json(
    {
        limit : "5mb" //default value 100kb
    }
));
app.use(cookieParser());//middleware to parse cookies from incoming requests
app.use(express.urlencoded({extended: true})); //to parse urlencoded bodies (as sent by HTML forms)

app.use("/api/auth",authRoute);
app.use("/api/users",userRoute); 
app.use("/api/posts",postRoute);
app.use("/api/notifications", notificationRoute);





app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

