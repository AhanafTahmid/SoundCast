import React, { useRef, useState } from "react";
import axios from "axios";

const OPENAI_MODELS = [
  { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
  { label: "GPT-4", value: "gpt-4" },
  { label: "GPT-4o", value: "gpt-4o" },
  // Add more models as needed
];

const CATEGORIES = [
  "Education",
  "Technology",
  "Entertainment",
  "Business",
  "Health",
  "Science",
  "History",
  "Music",
  "Sports",
  "News",
  "Comedy",
  "Society",
  "Culture",
  "Arts",
  "Other",
];

const CreatePodcast = () => {
  const [podcastTitle, setPodcastTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [thumbnailPrompt, setThumbnailPrompt] = useState("");
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [aiModel, setAiModel] = useState(OPENAI_MODELS[0].value);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const [aiAudioUrl, setAiAudioUrl] = useState<string | null>(null);
  const [aiThumbnailUrl, setAiThumbnailUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomImage(e.target.files[0]);
      setAiThumbnailUrl(null); // If uploading, clear AI thumbnail
    }
  };

  // Call your backend to generate podcast audio using OpenAI
  const handleGeneratePodcast = async () => {
    if (!aiPrompt) return;
    setGeneratingAudio(true);
    setAiAudioUrl(null);
    try {
      const res = await axios.post("/api/openai/generate", {
        prompt: aiPrompt,
        model: aiModel,
        title: podcastTitle,
        description,
      });
      setAiAudioUrl(res.data.audioUrl); // Your backend should return a URL or base64 audio
    } catch (err) {
      console.log(err);
      alert("Failed to generate podcast audio");
    } finally {
      setGeneratingAudio(false);
    }
  };

  // Call your backend to generate a thumbnail using OpenAI
  const handleGenerateThumbnail = async () => {
    if (!thumbnailPrompt) return;
    setGeneratingThumbnail(true);
    setAiThumbnailUrl(null);
    try {
      const res = await axios.post("/api/openai/thumbnail", {
        prompt: thumbnailPrompt,
        model: aiModel,
      });
      setAiThumbnailUrl(res.data.imageUrl); // Your backend should return a URL or base64 image
      setCustomImage(null); // If using AI, clear uploaded image
    } catch (err) {
      alert("Failed to generate thumbnail");
    } finally {
      setGeneratingThumbnail(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    // You can use aiAudioUrl or audioFile, and aiThumbnailUrl or customImage
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#181A20] rounded-lg border border-[#2A2D36] p-6 w-full max-w-xl mx-auto mt-8"
    >
      <h2 className="text-white text-xl font-semibold mb-6">Create a Podcast</h2>
      <div className="mb-4">
        <label className="block text-zinc-300 mb-1">Podcast title</label>
        <input
          type="text"
          className="w-full bg-transparent border border-[#2A2D36] rounded px-3 py-2 text-white focus:outline-none focus:border-orange-400"
          placeholder="Enter podcast title"
          value={podcastTitle}
          onChange={e => setPodcastTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-zinc-300 mb-1">Category</label>
        <div className="relative">
          <select
            className="w-full bg-transparent border border-[#2A2D36] rounded px-3 py-2 text-zinc-400 focus:outline-none max-h-40 overflow-y-auto"
            value={category}
            onChange={e => setCategory(e.target.value)}
            size={1}
            style={{ maxHeight: 160, overflowY: 'auto' }}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-zinc-300 mb-1">Description</label>
        <textarea
          className="w-full bg-transparent border border-[#2A2D36] rounded px-3 py-2 text-white focus:outline-none"
          placeholder="Write a short description about the podcast"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div className="mb-4">
        <label className="block text-zinc-300 mb-1">AI Model</label>
        <select
          className="w-full bg-transparent border border-[#2A2D36] rounded px-3 py-2 text-zinc-400 focus:outline-none"
          value={aiModel}
          onChange={e => setAiModel(e.target.value)}
        >
          {OPENAI_MODELS.map((model) => (
            <option key={model.value} value={model.value}>{model.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-zinc-300 mb-1">AI prompt to generate podcast</label>
        <div className="flex gap-2">
          <textarea
            className="flex-1 bg-transparent border border-[#2A2D36] rounded px-3 py-2 text-white focus:outline-none"
            placeholder="Provide text to AI to generate audio"
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            rows={2}
          />
          <button
            type="button"
            className="bg-[#23262F] text-white px-4 py-2 rounded border border-[#2A2D36] hover:bg-[#2A2D36] transition min-w-[120px]"
            onClick={handleGeneratePodcast}
            disabled={generatingAudio || !aiPrompt}
          >
            {generatingAudio ? "Generating..." : "Generate Podcast"}
          </button>
        </div>
        {aiAudioUrl && (
          <audio controls src={aiAudioUrl} className="mt-2 w-full" />
        )}
      </div>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="flex-1 bg-transparent border border-[#2A2D36] rounded px-3 py-2 text-white focus:outline-none"
          placeholder="AI prompt to generate thumbnail"
          value={thumbnailPrompt}
          onChange={e => setThumbnailPrompt(e.target.value)}
        />
        <button
          type="button"
          className="bg-[#23262F] text-white px-4 py-2 rounded border border-[#2A2D36] hover:bg-[#2A2D36] transition min-w-[120px]"
          onClick={handleGenerateThumbnail}
          disabled={generatingThumbnail || !thumbnailPrompt}
        >
          {generatingThumbnail ? "Generating..." : "AI generate thumbnail"}
        </button>
        <button
          type="button"
          className="bg-[#23262F] text-white px-4 py-2 rounded border border-[#2A2D36] hover:bg-[#2A2D36] transition"
          onClick={() => imageInputRef.current?.click()}
        >
          Upload custom image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
      <div className="mb-6">
        <label className="block text-zinc-300 mb-2">Thumbnail Preview</label>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#2A2D36] rounded-lg py-8 bg-[#181A20] min-h-[120px]">
          {aiThumbnailUrl && (
            <img src={aiThumbnailUrl} alt="AI Thumbnail" className="max-h-32 rounded mb-2" />
          )}
          {customImage && (
            <img src={URL.createObjectURL(customImage)} alt="Custom Thumbnail" className="max-h-32 rounded mb-2" />
          )}
          {!aiThumbnailUrl && !customImage && (
            <span className="text-zinc-400 text-sm">No thumbnail selected</span>
          )}
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-zinc-300 mb-2">Upload Audio</label>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#2A2D36] rounded-lg py-8 bg-[#181A20]">
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            id="audio-upload"
            onChange={e => setAudioFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="audio-upload" className="cursor-pointer text-zinc-400 hover:text-orange-400">
            Click to upload <span className="text-xs">(or drag and drop SVG, PNG, JPG or GIF, max. 1080x1080px)</span>
          </label>
          {audioFile && (
            <span className="mt-2 text-zinc-300 text-sm">{audioFile.name}</span>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded transition mt-4"
      >
        Submit &amp; publish podcast
      </button>
    </form>
  );
};

export default CreatePodcast;