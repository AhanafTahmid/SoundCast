import express from "express";
import { generatePodcastAudio, createPodcast, generateThumbnail, getAllPodcasts } from "../controller/podcast.controller.js";
// import multer from "multer";
// const storage = multer.memoryStorage(); // You can use diskStorage if needed
// const upload = multer({ storage });


const router = express.Router();

router.post("/generate", generatePodcastAudio);

router.post("/thumbnail", generateThumbnail);

router.post("/create",createPodcast);// Create a new podcast episode

router.get("/all-podcasts", getAllPodcasts);// Get all podcast episodes

export default router;
