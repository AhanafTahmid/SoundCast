import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Groq from 'groq-sdk';
import { Podcast } from "../models/podcast.model.js";
import cloudinary from "../lib/cloudinary.js";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const nebius = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
});

const gemini = new GoogleGenAI({});

// helper function to upload files to cloudinary 
const uploadToCloudinary = async (file) => {
    try {
        if (file.tempFilePath) {
            // express-fileupload
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                resource_type: "auto"
            });
            return result.secure_url;
        } else if (file.buffer) {
            // multer
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "auto" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
            return result.secure_url;
        } else {
            throw new Error("File format not supported for Cloudinary upload");
        }
    } catch (error) {
        console.log("Error in uploading to cloudinary", error);
        throw new Error("Error in uploading to cloudinary");
    }
}

export const uploadToCloudinaryIMG = async (imageUrl, folder = "images") => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder,
      resource_type: "image", // or "auto" if you're not sure
    });
    return result;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new Error("Error in uploading to cloudinary");
  }
};


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
    // Save to a temp file
    const fileName = `speech_${Date.now()}.wav`;
    const tempFilePath = path.join("tmp", fileName);
    await fs.promises.writeFile(tempFilePath, buffer);

    // Upload to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: "auto"
    });
    // Remove temp file after upload
    await fs.promises.unlink(tempFilePath);

    // Return Cloudinary URL
    res.json({ audioUrl: cloudinaryResult.secure_url });
  } catch (error) {
    next(error);
  }
};



export const generatePodcastText = async (req, res) => {
  const { category } = req.body;
  //console.log(req.body)
  const prompt = `Generate a 30 word interesting fact for the category: ${category}`;
  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }
  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const description = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a 8 word description based on those content: ${response.text}`,
  });
  console.log(response.text);
  console.log(description.text);
  res.json({ description: description.text, aiprompthere: response.text });
};


export const createPodcast = async (req, res, next) => {
  //console.log("Creating podcast with body:", req.body);
  //console.log("Creating podcast with body:", req.body);
 
  //console.log("Files in request:", req.files.imageFile);

  try {
    const { userName, title, category, description, aiVoice, aiPodcastPrompt, aiThumbnailPrompt, aiThumbnailURL, audiourl } = req.body;
      //console.log(aiThumbnailURL);
     //const image = req.files.imageFile;
    //  console.log("Files in request:", req.files);
    //  console.log("Files in request:", aiThumbnailPrompt);
    //  console.log("Files in request:", audioFile);

    if (!userName || !title || !category || !description || !aiVoice || !aiPodcastPrompt || !aiThumbnailURL || !audiourl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for uploaded files url
    // console.log("Files in request:", req.body);
    // console.log("Files in request:", req.files.audioFile, req.files.imageFile);
    // if (!req.files.audioFile || !req.files.imageFile) {
    //   return res.status(400).json({ message: "Please upload both audio and image files" });
    // }

    // // Upload audio and image to Cloudinary
    // console.log(aiThumbnailURL);
    // console.log(req.files.imageFile);
    //const audioUrl = await uploadToCloudinary(req.files.audioFile);
    const uploadResult = await uploadToCloudinaryIMG(aiThumbnailURL);
    const thumbnailUrl = uploadResult.secure_url;
    // audioUrl: must be provided from frontend (Cloudinary URL)
    const audioUrl = audiourl;
    // aiThumbnailPrompt: must be provided from frontend
    // Create podcast document in MongoDB
    const podcast = new Podcast({
      userName,
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
  //find all podcast by users
  try {
    const podcasts = await Podcast.find().sort({ createdAt: -1 });
    res.status(200).json(podcasts);
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    next(error);
  }
};

// Upload audio file to Cloudinary and return the URL
export const uploadAudioFile = async (req, res, next) => {
  try {
    console.log('req.files:', req.files);
    if (!req.files || !req.files.audioFile) {
      console.log('No audioFile found in req.files');
      return res.status(400).json({ message: "No audio file uploaded" });
    }
    const audioFile = req.files.audioFile;
    console.log('audioFile:', audioFile);
    const audioUrl = await uploadToCloudinary(audioFile);
    res.json({ audioUrl });
  } catch (error) {
    console.error('Error in uploadAudioFile:', error);
    next(error);
  }
};

// Upload image file to Cloudinary and return the URL
export const uploadImageFile = async (req, res, next) => {
  try {
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    let imageFile = req.files.imageFile;
    // If multiple files, take the first one
    if (Array.isArray(imageFile)) imageFile = imageFile[0];
    const imageUrl = await uploadToCloudinary(imageFile);
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error in uploadImageFile:', error);
    next(error);
  }
};
