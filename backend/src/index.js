import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import fileUpload from 'express-fileupload';
import { clerkMiddleware } from '@clerk/express';
import { initializeSocket } from  './lib/socket.js'
import GeneratePodCast from './routes/podcast.route.js'
import GenerateTTS from './routes/tts.route.js'
import cron from 'node-cron';

// Internal Imports
import { connectDB } from './lib/db.js';


// Routes
import userRouters from './routes/user.route.js';
import authRouters from './routes/auth.route.js';
import adminRouters from './routes/admin.route.js';
import songRouters from './routes/song.route.js';
import albumRouters from './routes/album.route.js';
import startRouters from './routes/stat.route.js';
import podcastRouters from './routes/podcast.route.js';
import audioRoutes from './routes/audioRoutes.js';
import lyricRouters from './routes/lyrics.route.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json()); // to parse req.body
app.use(clerkMiddleware()) //this will add to auth to req object => req.auth.userId
app.use(fileUpload(
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




// Create HTTP server
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json()); // For parsing application/json
app.use(clerkMiddleware()); // Clerk authentication

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'tmp'),
  createParentPath: true,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
}));
//podcast creating by ahanaf
app.use("/api/podcast", GeneratePodCast);
app.use("/api/tts", GenerateTTS);//text to speech routes

// Routes
app.use('/api/users', userRouters);
app.use('/api/auth', authRouters);
app.use('/api/admin', adminRouters);
app.use('/api/songs', songRouters);
app.use('/api/albums', albumRouters);
app.use('/api/stats', startRouters);
app.use('/api/podcast', podcastRouters);
app.use('/api/audio', audioRoutes);
app.use("/api/lyrics", lyricRouters);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// (Optional) Setup podcast media file serving
// const podcastDir = path.join(__dirname, 'podcastFiles');
// if (!fs.existsSync(podcastDir)) fs.mkdirSync(podcastDir);
// app.use('/podcastFiles', express.static(podcastDir));
// app.use('/podcastImages', express.static(podcastDir));

// Global Error Handler
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
  console.error(err);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

httpServer.listen(PORT,() => {
    console.log('Server is running on port',PORT);
    connectDB();
})
