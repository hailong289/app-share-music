import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const SongPage = () => {
  const { songId } = useParams();
  const { fetchSongById, currentSongDetail, isLoading } = useMusicStore();
  const { currentSong, isPlaying, playSong } = usePlayerStore();

  useEffect(() => {
    if (songId) fetchSongById(songId);
  }, [fetchSongById, songId]);

  if (isLoading) return null;

  const handlePlaySong = () => {
    playSong(currentSongDetail);
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        {/* Main Content */}
        <div className="relative min-h-full">
          {/* bg gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img
              src={currentSongDetail?.banner_url}
                alt={currentSongDetail?.title}
                className="w-[240px] h-[240px] shadow-xl rounded"
                crossOrigin="anonymous"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Song</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentSongDetail?.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {currentSongDetail?.artists.map((x) => x.name)}
                  </span>
                  <span>• {currentSongDetail?.createdAt.split("T")[0]}</span>
                </div>
              </div>
            </div>

            {/* play button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlaySong}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400
                hover:scale-105 transition-all"
              >
                {isPlaying && currentSong?._id === currentSongDetail?._id
                ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
export default SongPage;
