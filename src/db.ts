import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI: string = process.env.MONGO_URI!;
// Connect to MongoDB cloud
mongoose
    .connect(MONGO_URI, {
        dbName: process.env.DB_NAME
    })
    .then(() => console.log('WOOO MongoDB Connected'))
    .catch(err => console.log(err));
