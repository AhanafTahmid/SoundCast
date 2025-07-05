// // controllers/lyric.controller.js
// import fetch from "node-fetch";
// import Lyric from "../models/lyric.model.js";
// import express from "express";
// import dotenv from "dotenv";
// import fetch from "node-fetch";

// dotenv.config();
// const router = express.Router();

// export const generateLyrics = async (req, res) => {
//   const { mood, language } = req.body;
//   console.log(mood);

//   if (!mood || !language) {
//     return res.status(400).json({ message: "mood and language are required" });
//   }

//   const prompt =
//     language === "bn"
//       ? `একটি ${mood} অনুভূতির উপর ভিত্তি করে একটি আবেগময় বাংলা গানের লিরিকস লেখো।`
//       : `Write an emotional song lyric in English based on the mood: ${mood}`;

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//         }),
//       }
//     );

//     const result = await response.json();
//     const lyrics = result.candidates?.[0]?.content?.parts?.[0]?.text || "No lyrics generated.";

//     // Save to DB
//     const newLyric = new Lyric({ userName, prompt, lyrics });
//     await newLyric.save();

//     res.status(201).json({ message: "Lyrics generated", lyrics });
//   } catch (err) {
//     console.error("Gemini API Error:", err);
//     res.status(500).json({ error: "Failed to generate lyrics using Gemini." });
//   }
// };

// export const getAllLyrics = async (req, res) => {
//   try {
//     const lyrics = await Lyric.find().sort({ createdAt: -1 });
//     res.status(200).json(lyrics);
//   } catch (err) {
//     console.error("Get lyrics error:", err);
//     res.status(500).json({ error: "Failed to fetch lyrics" });
//   }
// };


// working 
// controllers/lyric.controller.js
import fetch from "node-fetch";
import Lyric from "../models/lyric.model.js";
import express from "express";
import dotenv from "dotenv";
// import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

export const generateLyrics = async (req, res) => {
 const { mood, language, userName } = req.body;
 console.log(mood , language ,userName);

  const prompt =
    language === "bn"
      ? `একটি ${mood} অনুভূতির উপর ভিত্তি করে একটি আবেগময় বাংলা গানের লিরিকস লেখো।`
      : `Write an emotional song lyric in English based on the mood: ${mood}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const result = await response.json();

    const lyrics =
      result.candidates?.[0]?.content?.parts?.[0]?.text || "No lyrics generated.";
    res.json({ lyrics });

     const newLyric = new Lyric({ 
      userName, 
      prompt: mood,
      lyrics
    });
    await newLyric.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate lyrics using Gemini REST." });
  }
};

export const getAllLyrics = async (req, res) => {
  try {
    const lyrics = await Lyric.find().sort({ createdAt: -1 });
    res.status(200).json(lyrics);
  } catch (err) {
    console.error("Get lyrics error:", err);
    res.status(500).json({ error: "Failed to fetch lyrics" });
  }
};

