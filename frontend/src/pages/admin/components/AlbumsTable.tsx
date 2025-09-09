import PaginationCustom from "@/components/pagination/PaginationCustom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Music, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AddAlbumDialog from "./AddAlbumDialog";

const AlbumsTable = () => {
	const { albums = [], deleteAlbum, fetchAlbums } = useMusicStore();
  const [albumsPagination, setAlbumsPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(albums.length / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    if (albums.length === 0) return;
    if (currentPage > 0) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setAlbumsPagination(albums.slice(startIndex, endIndex));
    } else {
      setCurrentPage(1);
    }
  }, [currentPage]);

  useEffect(() => {
    if (albums) setCurrentPage(0)
  }, [albums]);

	return (
		<Table>
			<TableHeader>
				<TableRow className='hover:bg-zinc-800/50'>
					<TableHead className='w-[50px]'></TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Artist</TableHead>
					<TableHead>Release Year</TableHead>
					<TableHead>Songs</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{albumsPagination.map((album) => (
					<TableRow key={album._id} className='hover:bg-zinc-800/50'>
						<TableCell>
							<img src={album.cover_url} alt={album.title} className='w-10 h-10 rounded object-cover' crossOrigin={album?.cover_url.includes("uploads") ? "anonymous" : undefined} />
						</TableCell>
						<TableCell className='font-medium text-zinc-400'>{album.title}</TableCell>
						<TableCell className='font-medium text-zinc-400'>{album?.artist && album?.artist.name}</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								<Calendar className='h-4 w-4' />
								{album.release_date.split("-")[0]}
							</span>
						</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								<Music className='h-4 w-4' />
								{album.total_songs} songs
							</span>
						</TableCell>
						<TableCell className='text-right'>
							<div className='flex gap-2 justify-end'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => deleteAlbum(album._id)}
									className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
								>
									<Trash2 className='h-4 w-4' />
								</Button>
                <AddAlbumDialog isEdit={true} data={album} />
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
export default AlbumsTable;
