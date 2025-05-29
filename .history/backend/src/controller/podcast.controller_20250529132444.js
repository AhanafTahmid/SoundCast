//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

import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Groq from 'groq-sdk';
import { Podcast } from "../models/podcast.model.js";
import cloudinary from "../lib/cloudinary.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const nebius = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
});

// helper function to upload files to cloudinary 
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type:"auto"
        })
        return result.secure_url;
    } catch (error) {
        console.log("Error in uploading to cloudinary",error);
        throw new Error("Error in uploading to cloudinary");
    }
}

// Generate podcast audio (returns text or audio URL)
export const generatePodcast = async (req, res, next) => {
  try {
    const { prompt, model, title, description } = req.body;
    if (!prompt || !model) {
      return res.status(400).json({ message: "Prompt and model are required" });
    }
    // Generate podcast script using OpenAI
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: `You are a helpful podcast script generator. Title: ${title || "Untitled"}. Description: ${description || ""}` },
        { role: "user", content: prompt },
      ],
      max_tokens: 1200,
      temperature: 0.8,
    });

    const script = completion.choices[0].message.content;
    res.json({ script });
  } catch (error) {
    next(error);
  }
};

// Generate podcast thumbnail (returns image URL or base64)
//https://youtu.be/pb_jYgSqGh0
export const generateThumbnail = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    // console.log(11111)
    // console.log(req.body)
    // console.log(prompt)

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }
    // Generate image using Nebius API, return as base64 data URL
    //by ahanaf
    //console.log(prompt);
    const imageResponse = await nebius.images.generate({
        "model": "black-forest-labs/flux-schnell",
        "response_format": "url",
        "response_extension": "png",
        "width": 1024,
        "height": 1024,
        "num_inference_steps": 4,
        "negative_prompt": "",
        "seed": -1,
        prompt,
    });
  
    const imageUrl = imageResponse.data[0].url;
    
    res.json({ imageUrl });
  } catch (error) {
    next(error);
  }
};

// Generate podcast audio using Groq TTS
//https://console.groq.com/docs/text-to-speech
export const generatePodcastAudio = async (req, res, next) => {
  try {
    const { text, model = "playai-tts", voice = "Fritz-PlayAI", responseFormat = "wav" } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Text is required for TTS generation" });
    }
    const response = await groq.audio.speech.create({
      model,
      voice,
      input: text,
      response_format: responseFormat
    });


    const buffer = Buffer.from(await response.arrayBuffer());
    // Save to a temp file and return the file path or serve as a download
    const fileName = `speech_${Date.now()}.wav`;
    const filePath = path.join("podcastFiles", fileName);
    await fs.promises.writeFile(filePath, buffer);
    // Option 1: Send the file as a download
    // res.download(filePath);
    // Option 2: Send the file URL (if you serve static files from /podcastFiles)
    res.json({ audioUrl: `/podcastFiles/${fileName}` });
  } catch (error) {
    next(error);
  }
};


export const createPodcast = async (req, res, next) => {
  console.log("Creating podcast with body:", req.body);
  try {
    const { userId, title, category, description, aiVoice, aiPodcastPrompt, aiThumbnailPrompt } = req.body;
    if (!userId || !title || !category || !description || !aiVoice || !aiPodcastPrompt || !aiThumbnailPrompt) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for uploaded files url
    // if (!req.files || !req.files.audioFile || !req.files.imageFile) {
    //   return res.status(400).json({ message: "Please upload both audio and image files" });
    // }

    // // Upload audio and image to Cloudinary
    const audioUrl = await uploadToCloudinary(req.files.audioFile);
    const thumbnailUrl = await uploadToCloudinary(req.files.imageFile);

    // Create podcast documeant in MongoDB
    
    const podcast = new Podcast({
      userId,
      title,
      category,
      description,
      aiVoice,
      aiPodcastPrompt,
      aiThumbnailPrompt,
      audioUrl,
      thumbnailUrl
    });
    await podcast.save();
    res.status(201).json({ message: "Created podcast successfully", podcast });
  } catch (error) {
    console.error("Error creating podcast:", error);
    next(error);
  }
};

export const getAllPodcasts = async (req, res, next) => {
  try {
    const podcasts = await Podcast.find().populate('userId', 'name email');
    res.json(podcasts);
  } catch (error) {
    next(error);
  }
};
