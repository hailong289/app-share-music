import { IPlaylist } from "@/types/music.types";
import { BaseService } from "../BaseService";
import { Playlist } from "@/models";


class PlayListService extends BaseService<IPlaylist> {
  public constructor() {
    super(Playlist);
  }

  public async getPlaylistsByUserId(userId: string): Promise<IPlaylist[]> {
    return this.model.find({ user_id: userId }).exec();
  }

  public async createPlaylist(playlistData: any): Promise<IPlaylist> {
    return this.create(playlistData);
  }

  public async updatePlaylist(playlistId: string, updateData: any): Promise<IPlaylist | null> {
    return this.updateById(playlistId, updateData);
  }

  public async deletePlaylist(playlistId: string): Promise<IPlaylist | null> {
    return this.deleteById(playlistId);
  }

  public async getPlaylistById(playlistId: string): Promise<IPlaylist | null> {
    return this.findById(playlistId);
  }

  public async getPublicPlaylists(): Promise<IPlaylist[]> {
    return this.find({ is_public: true });
  }


}

const playListService = new PlayListService();
export { playListService };
