// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT ;

import authRoute from "./routes/auth.rout.js";
import connectDB from "./db/connectDB.js";

app.use("/api/auth",authRoute);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});