import { useEffect, useRef, useState } from "react";
import axios from "axios";

const AllPodCast = () => {
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const prevAudioUrlRef = useRef<string | null>(null);
  // Use local state for podcasts
  const [localPodcasts, setLocalPodcasts] = useState<any[]>([]);

  // Fetch all podcasts from backend on mount and replace the store
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/podcast/all-podcasts");
        // Replace the podcast list in the store (not prepend)
        // We'll use a local state for this component to avoid duplicates
        setLocalPodcasts(res.data.reverse());
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchPodcasts();
  }, []);

  // Play audio when a new podcast's audio is selected
  const handlePlay = (idx: number, audioUrl: string) => {
    // Pause all other audios
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== idx) audio.pause();
    });
    // Play the selected audio
    const audio = audioRefs.current[idx];
    if (audio && prevAudioUrlRef.current !== audioUrl) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      prevAudioUrlRef.current = audioUrl;
    }
  };

  return (
    <div className="w-full mb-8 px-4 overflow-auto max-h-[calc(100vh-120px)]">
      <h3 className="text-white text-lg font-semibold mb-4">All Podcasts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {localPodcasts.length === 0 && (
          <div className="text-zinc-400 text-center">No podcasts yet.</div>
        )}
        {localPodcasts.map((podcast, idx) => (
          <div key={idx} className="bg-[#23262F] rounded-lg p-4 flex gap-4 items-center">
            <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-[#181A20]">
              <img
                src={podcast.thumbnailUrl}
                alt={podcast.title}
                className="w-full h-full object-cover object-center rounded"
                style={{ display: 'block', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold text-base">{podcast.title}</div>
              <div className="text-zinc-400 text-xs mb-1">{podcast.category} &middot; {new Date(podcast.createdAt).toLocaleString()}</div>
              <div className="text-zinc-300 text-sm mb-2 line-clamp-2">{podcast.description}</div>
              <audio
                ref={el => { audioRefs.current[idx] = el; }}
                controls
                src={podcast.audioUrl}
                className="w-full"
                onPlay={() => handlePlay(idx, podcast.audioUrl)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPodCast;