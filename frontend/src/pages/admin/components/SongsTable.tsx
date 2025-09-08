import PaginationCustom from "@/components/pagination/PaginationCustom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AddSongDialog from "./AddSongDialog";

const SongsTable = () => {
	const { songs = [], isLoading, error, deleteSong, fetchSongs } = useMusicStore();
  const [songsPagination, setSongsPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(songs.length / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    if (songs.length === 0) return;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setSongsPagination(songs.slice(startIndex, endIndex));
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [songs, fetchSongs]);

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-400'>Loading songs...</div>
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
					<TableHead>Title</TableHead>
					<TableHead>Artist</TableHead>
					<TableHead>Release Date</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{songsPagination.map((song) => (
					<TableRow key={song._id} className='hover:bg-zinc-800/50'>
						<TableCell>
							<img crossOrigin="anonymous" src={song.banner_url} alt={song.title} className='size-10 rounded object-cover' />
						</TableCell>
						<TableCell className='font-medium'>{song.title}</TableCell>
						<TableCell>{song.artists.map((x) => x.name)}</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								<Calendar className='h-4 w-4' />
								{song.createdAt.split("T")[0]}
							</span>
						</TableCell>

						<TableCell className='text-right'>
							<div className='flex gap-2 justify-end'>
								<Button
									variant={"ghost"}
									size={"sm"}
									className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
									onClick={() => deleteSong(song._id)}
								>
									<Trash2 className='size-4' />
								</Button>
                <AddSongDialog isEdit={true} data={song} />
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
export default SongsTable;
