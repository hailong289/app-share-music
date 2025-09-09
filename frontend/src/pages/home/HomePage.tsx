import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import FeaturedSession from "./components/FeaturedSession";

const HomePage = () => {
	const {
		isLoading,
		featuredSession,
    popularArtist,
    popularRadio,
    fetchHomeData
	} = useMusicStore();

	useEffect(() => {
		fetchHomeData();
	}, []);

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<ScrollArea className='h-[calc(100vh-180px)] w-full'>
				<div className='p-4 sm:p-6'>
					<div className='space-y-8'>
					  <FeaturedSession title={featuredSession.name} session={featuredSession} isLoading={isLoading}/>
					  <FeaturedSession title={popularRadio.name} session={popularRadio} isLoading={isLoading}/>
					  <FeaturedSession title={popularArtist.name} session={popularArtist} isLoading={isLoading}/>
					</div>
				</div>
			</ScrollArea>
		</main>
	);
};
export default HomePage;
