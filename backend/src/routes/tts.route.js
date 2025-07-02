import express from "express";
import { generateTTSAudio, createTTS, generateThumbnail, getAllTTS, uploadAudioFile, uploadImageFile, generateTTSText, generateTTSScript } from "../controller/tts.controller.js";
// import multer from "multer";
// const storage = multer.memoryStorage(); // You can use diskStorage if needed
// const upload = multer({ storage });


const router = express.Router();

router.post("/generate", generateTTSAudio);

router.post("/thumbnail", generateThumbnail);

router.post("/description", generateTTSText);

router.post("/generate-script", generateTTSScript);

router.post("/create",createTTS);// Create a new TTS episode

router.get("/all-tts", getAllTTS);// Get all TTS episodes

router.post("/upload-audio", uploadAudioFile); // Upload audio file and get Cloudinary URL

router.post("/upload-image", uploadImageFile); // Upload image file and get Cloudinary URL

export default router;
