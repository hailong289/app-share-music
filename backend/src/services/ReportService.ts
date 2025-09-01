import { Album, Playlist, Song, User } from "@/models";



class ReportService {
   public async getAllReports(): Promise<{
      totalSong: number;
      totalAlbum: number;
      totalPlaylist: number;
      totalArtist: number;
      totalUser: number;
   }> {
      const totalSong = await Song.countDocuments();
      const totalAlbum = await Album.countDocuments();
      const totalPlaylist = await Playlist.countDocuments();
      const totalArtist = await User.countDocuments({ role: 'artist' });
      const totalUser = await User.countDocuments({ role: 'user' });
      return {
         totalSong,
         totalAlbum,
         totalPlaylist,
         totalArtist,
         totalUser
      };
   }
}


const reportService = new ReportService();

export default reportService;
