import express, { Router } from 'express';
import dotenv from 'dotenv';
import userRouters from './routes/user.route.js'
import authRouters from './routes/auth.route.js'
import adminRouters from './routes/admin.route.js'
import songRouters from './routes/song.route.js'
import albumRouters from './routes/album.route.js'
import startRouters from './routes/stat.route.js'
import { connectDB } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express'
import fileupload from 'express-fileupload'
import path from 'path';
import fs from 'fs';
import cors from 'cors'
import { createServer } from 'http';
import { initializeSocket } from  './lib/socket.js'
import Generate from './routes/podcast.route.js'
import cron from 'node-cron';

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

// cron jobs
//delete files from tmp directory every hour
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});


const PORT = process.env.PORT

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true
}))

app.use("/api/users", userRouters);
app.use("/api/auth",authRouters);
app.use("/api/admin",adminRouters);
app.use("/api/songs",songRouters);
app.use("/api/albums",albumRouters);
app.use("/api/stats",startRouters)

//podcast creating by ahanaf
app.use("/api/podcast", Generate);

// Ensure podcastFiles directory exists at startup
// const tmpDir = path.join(__dirname, 'podcastFiles');
// if (!fs.existsSync(tmpDir)) {
//     fs.mkdirSync(tmpDir);
// }

// // Serve static files from tmp directory for audio playback
// app.use('/podcastFiles', express.static(tmpDir));
// app.use('/podcastImages', express.static(tmpDir));

if( process.env.NODE_ENV === 'production' ){
    // Serve static files from the 'frontend/build' directory
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // Handle all GET requests by sending the index.html file
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    })
}

// error handling
app.use((err, req, res, next) => {
    //console.log(err);
    res.status(500).json({message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message});
});

httpServer.listen(PORT,() => {
    console.log('Server is running on port',PORT);
    connectDB();
})

// todo socket io