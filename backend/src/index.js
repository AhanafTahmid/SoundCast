import express, { Router } from 'express';
import dotenv from 'dotenv';
import userRouters from './routers/user.route.js'
import authRouters from './routers/auth.route.js'
import adminRouters from './routers/admin.route.js'
import songRouters from './routers/song.route.js'
import albumRouters from './routers/album.route.js'
import startRouters from './routers/star.route.js'
import { connectDB } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express'

dotenv.config();
const app = express();
app.use(express.json()); // to parse req.body
app.use(clerkMiddleware()) //this will add to auth to req object => req.auth.userId
const PORT = process.env.PORT

app.use("/api/users", userRouters);
app.use("/api/auth",authRouters);
app.use("/api/admin",adminRouters);
app.use("/api/songs",songRouters);
app.use("/api/albums",albumRouters);
app.use("/api/stars",startRouters)

app.listen(PORT,() => {
    console.log('Server is running on port',PORT);
    connectDB();
})