import { useRef } from "react";
import { usePodcastStore } from "@/stores/usePodcastStore";

const AllPodCast = () => {
  const podcastList = usePodcastStore((s) => s.podcastList);
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const prevAudioUrlRef = useRef<string | null>(null);

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
  //get all podcasts from the store
  

  return (
    <div className="w-full mb-8 px-4">
      <h3 className="text-white text-lg font-semibold mb-4">All Podcasts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {podcastList.length === 0 && (
          <div className="text-zinc-400 text-center">No podcasts yet.</div>
        )}
        {podcastList.map((podcast, idx) => (
          <div key={idx} className="bg-[#23262F] rounded-lg p-4 flex gap-4 items-center">
            <img src={podcast.thumbnailUrl} alt={podcast.title} className="w-20 h-20 object-cover rounded" />
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