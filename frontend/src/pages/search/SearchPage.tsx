import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchItem from "./components/SearchItem";
import { useParams } from "react-router-dom";

const SearchPage = () => {
  const { keyword = "" } = useParams();
  const {
    searchAll,
    searchAllData,
    isLoading,
  } = useMusicStore();
  const { songs, albums, artists } = searchAllData || {};
  const handleSearch = async (value) => {
    await searchAll({ q: value });
  };

	useEffect(() => {
		handleSearch(keyword);
	}, [keyword]);

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<ScrollArea className='h-[calc(100vh-180px)] w-full'>
				<div className='p-4 sm:p-6'>
					<div className='space-y-8'>
					  <SearchItem title='Song' items={songs} type="song" isLoading={isLoading}/>
					  <SearchItem title='Artist' items={artists} type="artist" isLoading={isLoading}/>
					  <SearchItem title='Album' items={albums} type="album" isLoading={isLoading}/>
					</div>
				</div>
			</ScrollArea>
		</main>
	);
};
export default SearchPage;
