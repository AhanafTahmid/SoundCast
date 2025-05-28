import express from "express";
import { generatePodcastAudio, generatePodcast, generateThumbnail, createPodcast, getAllPodcasts } from "../controller/podcast.controller.js";

const router = express.Router();

router.post("/generate", generatePodcastAudio);

router.post("/thumbnail", generateThumbnail);

router.post("/create", createPodcast);

router.get("/all-podcasts", getAllPodcasts);

export default router;
