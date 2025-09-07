// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express();
const PORT = process.env.PORT ;

import authRoute from "./routes/auth.rout.js";
import connectDB from "./db/connectDB.js";

app.use(express.json());
app.use(cookieParser());    

app.use("/api/auth",authRoute);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

