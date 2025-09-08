import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play, SearchIcon, Share2, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EditPlaylistDialog from "./components/EditPlaylistDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import toast from "react-hot-toast";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlaylistPage = () => {
  const { playlistId = "" } = useParams();
  const {
    fetchPlaylistById,
    currentAlbum,
    isLoading,
    searchSongs,
    searchSongData,
    addSongToPlaylist,
    deletePlaylist,
    refreshSearchSongs,
  } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isCreator = user?._id && user?._id === currentAlbum?.user_id;

  useEffect(() => {
    if (playlistId) fetchPlaylistById(playlistId);
    refreshSearchSongs();
  }, [fetchPlaylistById, playlistId]);

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) togglePlay();
    else {
      // start playing the album from the beginning
      playAlbum(currentAlbum?.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;

    playAlbum(currentAlbum?.songs, index);
  };

  const onAddSongToPlaylist =
    (playlistId: string | undefined, songId: string) => async () => {
      if (!playlistId) return;
      await addSongToPlaylist(playlistId, songId);
      await fetchPlaylistById(playlistId);
    };

  const handleSearch = async (value: string) => {
    await searchSongs({ search: value });
  };

  const onDeletePlaylist = async () => {
    await deletePlaylist(playlistId);
    navigate("/");
  };

  const onCopyLinkPlaylist = async () => {
    const currentUrl = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
    await navigator.clipboard.writeText(currentUrl);
    toast.success("Đã copy link!");
  };

  const debouncedSearch = useDebounce(handleSearch, 500);

  if (isLoading) return null;
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
                crossOrigin="anonymous"
                src={currentAlbum?.banner_url}
                alt={currentAlbum?.name}
                className="w-[240px] h-[240px] shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Playlist</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentAlbum?.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {currentAlbum?.artist}
                  </span>
                  <span>• {currentAlbum?.songs?.length} songs</span>
                  <span>• {currentAlbum?.releaseYear}</span>
                </div>
              </div>
            </div>

            {/* play button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400
                hover:scale-105 transition-all"
              >
                {isPlaying &&
                currentAlbum?.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
              {
                isCreator && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <EditPlaylistDialog playlistId={playlistId} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit playlist</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          onClick={onDeletePlaylist}
                          size="icon"
                          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400
                          hover:scale-105 transition-all"
                        >
                          <Trash2 className="h-7 w-7 text-white" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove Playlist</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          onClick={onCopyLinkPlaylist}
                          size="icon"
                          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-400
                          hover:scale-105 transition-all"
                        >
                          <Share2 className="h-7 w-7 text-white" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy link Playlist</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              }
            </div>

            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-10 py-2 text-sm
              text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
                <div></div>
              </div>

              {/* songs list */}

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs?.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className={`grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-4 py-2 text-sm
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
                      `}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-green-500">♫</div>
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            crossOrigin="anonymous"
                            src={song.banner_url}
                            alt={song.title}
                            className="size-10"
                          />

                          <div>
                            <div className={`font-medium text-white`}>
                              {song.title}
                            </div>
                            <div>{song.artist}</div>
                          </div>
                        </div>
                        <div className='flex items-center'>{song.createdAt.split("T")[0]}</div>
                        <div className="flex items-center">
                          {formatDuration(song.duration)}
                        </div>
                        <div className="flex items-center">
                          {
                            isCreator && (
                              <Button
                                onClick={onAddSongToPlaylist(playlistId, song._id)}
                                size="default"
                                variant="ghost"
                                className="hidden lg:inline-flex text-zinc-400"
                              >
                                Remove
                              </Button>
                            )
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          isCreator && (
            <>
              {/* find song */}
              <div className="px-6 py-2">
                <div className={`font-medium text-white text-xl`}>
                  Let's find something for your playlist
                </div>
                <div className="relative w-1/2 py-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon className="text-gray-500" />
                  </div>
                  <input
                    onChange={(e) => debouncedSearch(e.target.value)}
                    type="text"
                    className="w-full pl-10 pr-10 py-2 rounded-full bg-zinc-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Search for songs, artists, albums..."
                  />
                </div>
              </div>

              {/* songs list */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {searchSongData?.map((song, index) => {
                    return (
                      <div
                        key={song._id}
                        className={`grid grid-cols-[4fr_1fr] gap-4 px-4 py-2 text-sm
                        text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            crossOrigin="anonymous"
                            src={song.banner_url}
                            alt={song.title}
                            className="size-10"
                          />

                          <div>
                            <div className={`font-medium text-white`}>
                              {song.title}
                            </div>
                            <div>{song.artists.map((x) => x.name)}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Button
                            onClick={onAddSongToPlaylist(playlistId, song._id)}
                            size="icon"
                            variant="ghost"
                            className="hidden sm:inline-flex text-zinc-400"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )
        }
      </ScrollArea>
    </div>
  );
};
export default PlaylistPage;
