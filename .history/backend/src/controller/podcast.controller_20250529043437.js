//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

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
export const generateThumbnail = async (req, res, next) => {
  try {
    const { prompt, model } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }
    // Generate image using OpenAI DALL-E
    const imageResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: "512x512",
      response_format: "url"
    });
    const imageUrl = imageResponse.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    next(error);
  }
};