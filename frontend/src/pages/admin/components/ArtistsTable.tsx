import PaginationCustom from "@/components/pagination/PaginationCustom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AddArtistDialog from "./AddArtistDialog";

const ArtistsTable = () => {
	const { artists = [], isLoading, error, deleteArtist, fetchArtists } = useMusicStore();
  const [artistsPagination, setArtistsPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(artists.length / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    if (artists.length === 0) return;
    if (currentPage > 0) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setArtistsPagination(artists.slice(startIndex, endIndex));
    } else {
      setCurrentPage(1);
    }
  }, [currentPage]);

  useEffect(() => {
    if (artists && !isLoading) setCurrentPage(0);
  }, [artists]);

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-400'>Loading artists...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-red-400'>{error}</div>
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className='hover:bg-zinc-800/50'>
					<TableHead className='w-[50px]'></TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Bio</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{artistsPagination.map((artist) => (
					<TableRow key={artist._id} className='hover:bg-zinc-800/50'>
						<TableCell>
							<img crossOrigin="anonymous" src={artist.image_url} alt={artist.name} className='size-10 rounded object-cover' />
						</TableCell>
						<TableCell className='font-medium'>{artist.name}</TableCell>
						<TableCell>{artist.email}</TableCell>
						<TableCell>{artist.bio}</TableCell>
						<TableCell className='text-right'>
							<div className='flex gap-2 justify-end'>
								<Button
									variant={"ghost"}
									size={"sm"}
									className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
									onClick={async () => {
                    await deleteArtist(artist._id)
                    await fetchArtists({})
                  }}
								>
									<Trash2 className='size-4' />
								</Button>
                <AddArtistDialog isEdit={true} data={artist} />
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
      <TableFooter>
        <tr>
          <td colSpan={999}>
            <PaginationCustom
              currentPage={currentPage}
              totalPages={totalPages}
              handleChange={(page) => setCurrentPage(page)}
              pageNumbers={pageNumbers}
            />
          </td>
        </tr>
      </TableFooter>
		</Table>
	);
};
export default ArtistsTable;
