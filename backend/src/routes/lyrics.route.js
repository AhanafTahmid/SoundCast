import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { mood, language } = req.body;

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate lyrics using Gemini REST." });
  }
});

export default router;
