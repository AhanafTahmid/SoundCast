import express from "express";
import { generatePodcastAudio, generatePodcast, generateThumbnail } from "../controller/podcast.controller.js";

const router = express.Router();

router.post("/generate", generatePodcastAudio);

router.post("/thumbnail", generateThumbnail);

export default router;
