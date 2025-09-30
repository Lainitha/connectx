// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import cors from 'cors';
import path from "path"
import { fileURLToPath } from 'url';


dotenv.config();

const app = express();
// Resolve the directory of this file reliably in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true
}));
const PORT = process.env.PORT || 5000;
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


if (process.env.NODE_ENV==="production"){
    const staticPath = path.resolve(__dirname, "..", "frontend", "dist");
    app.use(express.static(staticPath));

    // SPA fallback using RegExp to avoid path-to-regexp parsing
    // Serve index.html for any GET that does not start with /api
    app.get(/^\/(?!api).*/, (req, res) => {
        const indexPath = path.resolve(__dirname, "..", "frontend", "dist", "index.html");
        res.sendFile(indexPath);
    });
} else {
    app.get('/', (req, res) => {
        res.send('<h1>Backend is running!</h1><p>Run frontend with: npm run dev</p>');
    });
}


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} (${process.env.NODE_ENV})`);
    connectDB();
});

