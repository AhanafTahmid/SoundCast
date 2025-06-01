// import React, { useState } from 'react';
// import axios from 'axios';
// import { Sparkles } from 'lucide-react';

// const LyricsGenerator = () => {
//   const [prompt, setPrompt] = useState('');
//   const [lyrics, setLyrics] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleGenerate = async () => {
//     if (!prompt.trim()) return;
//     setLoading(true);
//     try {
//       const res = await axios.post('/api/generate-lyrics', { prompt });
//       setLyrics(res.data.lyrics);
//     } catch (err) {
//       console.error(err);
//       setLyrics('❌ Failed to generate lyrics.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border border-blue-100">
//       <div className="flex items-center gap-2 mb-6">
//         <Sparkles className="text-blue-500 w-6 h-6" />
//         <h2 className="text-2xl font-semibold text-blue-800">AI Lyrics Generator</h2>
//       </div>

//       <input
//         type="text"
//         className="w-full p-3 text-lg border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
//         placeholder="e.g. Uplifting pop song about summer love"
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//       />

//       <button
//         className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-medium transition-all duration-300 disabled:opacity-50"
//         onClick={handleGenerate}
//         disabled={loading}
//       >
//         {loading ? '🎤 Generating...' : '🎵 Generate Lyrics'}
//       </button>

//       {lyrics && (
//         <div className="mt-8 p-5 bg-white border-2 border-blue-200 rounded-xl shadow-inner text-gray-800 whitespace-pre-wrap">
//           <h3 className="text-lg font-bold text-blue-600 mb-2">Your Lyrics:</h3>
//           {lyrics}
//         </div>
//       )}
//     </div>
//   );
// };

// export default LyricsGenerator;
