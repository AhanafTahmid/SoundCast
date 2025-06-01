import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import fileUpload from 'express-fileupload';
import { clerkMiddleware } from '@clerk/express';

// Internal Imports
import { connectDB } from './lib/db.js';
import { initializeSocket } from './lib/socket.js';

// Routes
import userRouters from './routes/user.route.js';
import authRouters from './routes/auth.route.js';
import adminRouters from './routes/admin.route.js';
import songRouters from './routes/song.route.js';
import albumRouters from './routes/album.route.js';
import startRouters from './routes/stat.route.js';
import podcastRouters from './routes/podcast.route.js';
import audioRoutes from './routes/audioRoutes.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

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

// Routes
app.use('/api/users', userRouters);
app.use('/api/auth', authRouters);
app.use('/api/admin', adminRouters);
app.use('/api/songs', songRouters);
app.use('/api/albums', albumRouters);
app.use('/api/stats', startRouters);
app.use('/api/podcast', podcastRouters);
app.use('/api/audio', audioRoutes);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// (Optional) Setup podcast media file serving
// const podcastDir = path.join(__dirname, 'podcastFiles');
// if (!fs.existsSync(podcastDir)) fs.mkdirSync(podcastDir);
// app.use('/podcastFiles', express.static(podcastDir));
// app.use('/podcastImages', express.static(podcastDir));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  connectDB();
  initializeSocket(httpServer);
});
