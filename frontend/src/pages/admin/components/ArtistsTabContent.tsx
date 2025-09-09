import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from "lucide-react";
import ArtistsTable from "./ArtistsTable";
import AddArtistDialog from "./AddArtistDialog";

const ArtistsTabContent = () => {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Music className='size-5 text-emerald-500' />
							Artists Library
						</CardTitle>
						<CardDescription>Manage your music tracks</CardDescription>
					</div>
					<AddArtistDialog />
				</div>
			</CardHeader>
			<CardContent>
				<ArtistsTable />
			</CardContent>
		</Card>
	);
};
export default ArtistsTabContent;
