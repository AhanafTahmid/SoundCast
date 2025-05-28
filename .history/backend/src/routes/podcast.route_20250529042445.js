import express from "express";
import { generatePodcastAudio, generatePodcast, generateThumbnail, createPodcast, getAllPodcasts } from "../controller/podcast.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", generatePodcastAudio);

router.post("/thumbnail", generateThumbnail);

router.post("/create", protectRoute, createPodcast);

router.get("/all-podcasts", getAllPodcasts);

export default router;
