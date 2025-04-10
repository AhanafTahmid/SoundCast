import express, { Router } from 'express';
import dotenv from 'dotenv';
import userRouters from './routers/user.route.js'
import authRouters from './routers/auth.route.js'
import adminRouters from './routers/admin.route.js'
import songRouters from './routers/song.route.js'
import albumRouters from './routers/album.route.js'
import startRouters from './routers/stat.route.js'
import { connectDB } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express'
import fileupload from 'express-fileupload'
import path from 'path'

dotenv.config();
const __dirname = path.resolve();
const app = express();
app.use(express.json()); // to parse req.body
app.use(clerkMiddleware()) //this will add to auth to req object => req.auth.userId
app.use(fileupload(
    {useTempFiles: true,
        tempFileDir: path.join(__dirname,'tmp'),
        createParentPath: true,
        limits:{
            fileSize: 10*1024*1024 //10mb max file size 
        }
    }
))
const PORT = process.env.PORT

app.use("/api/users", userRouters);
app.use("/api/auth",authRouters);
app.use("/api/admin",adminRouters);
app.use("/api/songs",songRouters);
app.use("/api/albums",albumRouters);
app.use("/api/stats",startRouters)

// error handling
app.use((err, req, res, next) => {
    res.status(500).json({message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message});
});

app.listen(PORT,() => {
    console.log('Server is running on port',PORT);
    connectDB();
})

// todo socket io 