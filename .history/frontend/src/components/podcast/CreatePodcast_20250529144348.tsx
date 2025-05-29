import React, { useRef, useState } from "react";
import axios from "axios";
import { usePodcastStore } from "@/stores/usePodcastStore";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

const GROQ_VOICE = [
  // Groq TTS voices
  { label: "Arista", value: "Arista-PlayAI" },
  { label: "Atlas", value: "Atlas-PlayAI" },
  { label: "Basil", value: "Basil-PlayAI" },
  { label: "Briggs", value: "Briggs-PlayAI" },
  { label: "Calum", value: "Calum-PlayAI" },
  { label: "Celeste", value: "Celeste-PlayAI" },
  { label: "Cheyenne", value: "Cheyenne-PlayAI" },
  { label: "Chip", value: "Chip-PlayAI" },
  { label: "Cillian", value: "Cillian-PlayAI" },
  { label: "Deedee", value: "Deedee-PlayAI" },
  { label: "Fritz", value: "Fritz-PlayAI" },
  { label: "Gail", value: "Gail-PlayAI" },
  { label: "Indigo", value: "Indigo-PlayAI" },
  { label: "Mamaw", value: "Mamaw-PlayAI" },
  { label: "Mason", value: "Mason-PlayAI" },
  { label: "Mikail", value: "Mikail-PlayAI" },
  { label: "Mitch", value: "Mitch-PlayAI" },
  { label: "Quinn", value: "Quinn-PlayAI" },
  { label: "Thunder", value: "Thunder-PlayAI" }
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

// helper function to upload files to cloudinary 
// const uploadToCloudinary = async (file) => {
//     try {
//         const result = await cloudinary.uploader.upload(file.tempFilePath, {
//             resource_type:"auto"
//         })
//         return result.secure_url;
//     } catch (error) {
//         console.log("Error in uploading to cloudinary",error);
//         throw new Error("Error in uploading to cloudinary");
//     }
// }

const CreatePodcast = () => {
  const [podcastTitle, setPodcastTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [thumbnailPrompt, setThumbnailPrompt] = useState("");
  const [aiVoice, setaiVoice] = useState(GROQ_VOICE[0].value);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const [aiAudioUrl, setAiAudioUrl] = useState<string | null>(null);
  const [aiThumbnailUrl, setAiThumbnailUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [customImage, setCustomImage] = useState<File | null>(null);

  const addPodcast = usePodcastStore((s) => s.addPodcast);
  const podcastList = usePodcastStore((s) => s.podcastList);
  const { user } = useUser();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      //console.log("Image uploaded:", e.target.files[0]);
      setCustomImage(e.target.files[0]);
      setAiThumbnailUrl(URL.createObjectURL(e.target.files[0])); // Set thumbnailUrl to custom image
    }
  };

  // Handle audio file upload from user
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      setAiAudioUrl(URL.createObjectURL(e.target.files[0])); // For preview
    }
  };  
  
  // Call your backend to generate podcast audio using OpenAI
  const handleGeneratePodcast = async () => {
    if (!aiPrompt) {
      toast.error("Please enter the AI prompt to generate podcast audio");
      return;
    }
    if (!podcastTitle || !category || !description) {
      toast.error("Please fill in the podcast title, category, and description before generating audio");
      return;
    }
    setGeneratingAudio(true);
    setAiAudioUrl(null);
    try {
      const res = await axios.post("http://localhost:5000/api/podcast/generate", {
        text: aiPrompt,
        model: 'playai-tts',
        voice: aiVoice,
        description,
      });
      setAiAudioUrl(res.data.audioUrl); // Your backend should return a URL or base64 audio
      toast.success("Podcast audio generated!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to generate podcast audio");
    } finally {
      setGeneratingAudio(false);
    }
  };

  // Call your backend to generate a thumbnail using OpenAI
  const handleGenerateThumbnail = async () => {
    if (!thumbnailPrompt) return;
    setGeneratingThumbnail(true);
    setAiThumbnailUrl(null);
    setCustomImage(null); // If using AI, clear uploaded image
    try {
      const res = await axios.post("http://localhost:5000/api/podcast/thumbnail", {
          prompt: thumbnailPrompt
      });
      setAiThumbnailUrl(res.data.imageUrl); // Your backend should return a URL or base64 image
    } catch (err) {
      //alert("Failed to generate thumbnail");
    } finally {
      setGeneratingThumbnail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();

    // Validate required fields
    if (podcastTitle==="" || category === "" || description === "" || !aiAudioUrl || !aiThumbnailUrl) {
      toast.error("Please enter all details");
      return;
    }

    // Prevent duplicate podcast (same title, description, audio, and thumbnail)
    const isDuplicate = podcastList.some(
      (p) =>
        p.title === podcastTitle &&
        p.description === description &&
        p.audioUrl === aiAudioUrl &&
        p.thumbnailUrl === aiThumbnailUrl
    );
    if (isDuplicate) {
      toast.error("You cannot create the same podcast twice");
      return;
    }

    if (!user) {
      toast.error("You must be signed in to create a podcast");
      return;
    }

    //push in dbms
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("title", podcastTitle);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("aiVoice", aiVoice);
    formData.append("aiPodcastPrompt", aiPrompt);
    formData.append("aiThumbnailPrompt", thumbnailPrompt);
    // formData.append("audioFile", audioFile);
    // formData.append("imageFile", customImage);
    console.log("Audio file:", audioFile);
    //console.log("Custom image:", customImage);
    
    


    // console.log("Form data prepared for submission:", formData);
    // console.log("audio", formData.get("audioFile"));
    // console.log("image", formData.get("imageFile"));

    await axios.post("http://localhost:5000/api/podcast/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Podcast created successfully!");

    const newPodcast = {
      title: podcastTitle,
      category,
      description,
      audioUrl: aiAudioUrl!,
      thumbnailUrl: aiThumbnailUrl, // Always use aiThumbnailUrl (AI or custom)
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    //const newPodcastMongo = await axios.post("http://localhost:5000/api/podcast/create", newPodcast);
    // console.log(aiThumbnailUrl);

    addPodcast(newPodcast);
    // console.log("Toast should show now");
    // Optionally reset form fields here
  };

  // Only allow podcast creation if all required fields are present (no fallback to customImage)
  // const isFormComplete = podcastTitle && category && description && aiAudioUrl && aiThumbnailUrl;

  // Play audio automatically when aiAudioUrl is set
  React.useEffect(() => {
    if (aiAudioUrl && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [aiAudioUrl]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-[#181A20] rounded-lg border border-[#2A2D36] p-6 w-full max-w-xl mx-auto mt-8 mb-4"
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
          <label className="block text-zinc-300 mb-1">AI Voice</label>
          <select
            className="w-full bg-transparent border border-[#2A2D36] rounded px-3 py-2 text-zinc-400 focus:outline-none"
            value={aiVoice}
            onChange={e => setaiVoice(e.target.value)}
          >
            {GROQ_VOICE.map((voice) => (
              <option key={voice.value} value={voice.value}>{voice.label}</option>
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
              onClick={handleAudioUpload}
              disabled={generatingAudio || !aiPrompt}
            >
              {generatingAudio ? "Generating..." : "Generate Podcast"}
            </button>
          </div>
          {aiAudioUrl && (
            <audio ref={audioRef} controls src={aiAudioUrl} className="mt-2 w-full" />
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
              <img src={aiThumbnailUrl} alt="Thumbnail" className="max-h-auto rounded mb-2 w-95" />
            )}
            {!aiThumbnailUrl && (
              <span className="text-zinc-400 text-sm">No thumbnail selected</span>
            )}
          </div>
        </div>

            <div className="w-full max-w-xl mx-auto mb-10">
            <button
          type="button"
          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded transition mt-4 disabled:opacity-50"
          // disabled={!isFormComplete}
          onClick={handleSubmit}
        >
          Create Podcast
        </button>
             </div>


      </form>

    </div>
  );
};

export default CreatePodcast;