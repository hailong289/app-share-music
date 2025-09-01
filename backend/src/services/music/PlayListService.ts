import { IPlaylist } from "@/types/music.types";
import { BaseService } from "../BaseService";
import { Playlist, PlaylistSong } from "@/models";
import { Types } from "mongoose";


class PlayListService extends BaseService<IPlaylist> {
  public constructor() {
    super(Playlist);
  }

  public async getPlaylistsByUserId(userId: string): Promise<IPlaylist[]> {
    console.log('Fetching playlists for userId:', userId);
    return this.model.find({ user_id: new Types.ObjectId(userId) }).exec();
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

  public async getPlaylistById(playlistId: string): Promise<any> {
    const playlist = await this.model.aggregate([
      {
        $match: { _id: new Types.ObjectId(playlistId) }
      },
      {
        $lookup: {
          from: "playlistsongs",
          let: { pid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$playlist_id", "$$pid"] } } },
            {
              $lookup: {
                from: "songs",
                localField: "song_id",
                foreignField: "_id",
                as: "song"
              }
            },
            { $unwind: "$song" },
            { $replaceWith: "$song" }
          ],
          as: "songs"
        }
      },
    ]);
    return playlist[0] ?? [];
  }

  public async getPublicPlaylists(): Promise<IPlaylist[]> {
    return this.find({ is_public: true });
  }

  public async getAllPlaylists(query: { page?: number; limit?: number;} = {}): Promise<IPlaylist[]> {
    if (query.page && query.limit) {
      const { page, limit } = query;
      return this.model.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    }
    return this.find({});
  }

  public async addSongToPlaylist(playlistId: string, data: {
    song_id: string;
    order: number;
  }): Promise<any> {
    const playListSong = await PlaylistSong.create({
      playlist_id: playlistId,
      song_id: data.song_id,
      order: data.order
    });
    if (!playListSong) {
      throw new Error("Failed to add song to playlist");
    }
    return this.getPlaylistById(playlistId);
  }
}

const playListService = new PlayListService();
export { playListService };
