import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { HomeIcon, Library, MessageCircle, Plus } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import AddPlaylistDialog from "./AddPlaylistDialog";

const LeftSidebar = () => {
	const { playlists, fetchPlayList, isLoading } = useMusicStore();

	useEffect(() => {
		fetchPlayList();
	}, [fetchPlayList]);

	return (
		<div className='h-full flex flex-col gap-2'>
			{/* Library section */}
			<div className='flex-1 rounded-lg bg-zinc-900 p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center text-white px-2'>
						<Library className='size-5 mr-2' />
						<span className='hidden md:inline'>Playlists</span>
					</div>
          <AddPlaylistDialog />
				</div>

				<ScrollArea className='h-[calc(100vh-300px)]'>
					<div className='space-y-2'>
						{isLoading ? (
							<PlaylistSkeleton />
						) : (
							playlists.map((album) => (
								<Link
									to={`/playlist/${album._id}`}
									key={album._id}
									className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
								>
									<img
                    crossOrigin={album.banner_url.includes("uploads") ? "anonymous" : undefined}
										src={album.banner_url}
										alt='Playlist img'
										className='size-12 rounded-md flex-shrink-0 object-cover'
									/>

									<div className='flex-1 min-w-0 hidden md:block'>
										<p className='font-medium truncate'>{album.name}</p>
										<p className='text-sm text-zinc-400 truncate'>Playlist • {album.artist}</p>
									</div>
								</Link>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};
export default LeftSidebar;
