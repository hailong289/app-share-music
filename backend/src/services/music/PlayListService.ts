import { IPlaylist } from "@/types/music.types";
import { BaseService } from "../BaseService";
import { Playlist, PlaylistSong, SessionItems, Sessions, User } from "@/models";
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
    const playlist = await this.create(playlistData);
    if (playlistData.session_id) {
      const existingPlaylist = await Sessions.findOne({ _id: new Types.ObjectId(playlistData.session_id) });
      if (!existingPlaylist) {
        this.deleteById(playlist._id.toString());
        throw new Error("Session not found");
      }
      SessionItems.create({
        item_id: playlist._id,
        item_type: "playlist",
        session_id: playlistData.session_id
      })
      delete playlistData.session_id;
    }
    return playlist;
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
      {
        $addFields: {
          banner_url: {
            $concat: [
              `${process.env.APP_URL}/`,
              { $replaceAll: { input: "$banner_url", find: "\\", replacement: "/" } }
            ]
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }
    ]);
    return playlist[0] ?? [];
  }

  public async getPublicPlaylists(): Promise<IPlaylist[]> {
    return this.find({ is_public: true });
  }

  public async getAllPlaylists(query: { page?: number; limit?: number; } = {}): Promise<IPlaylist[]> {
    if (query.page && query.limit) {
      const { page, limit } = query;
      return this.model.aggregate([
        { $skip: (Number(page) - 1) * Number(limit) },
        { $limit: Number(limit) },
        {
          $addFields: {
            banner_url: {
              $concat: [
                `${process.env.APP_URL}/`,
                { $replaceAll: { input: "$banner_url", find: "\\", replacement: "/" } }
              ]
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" }
      ]);
    }
    return this.aggregate([
      {
        $addFields: {
          banner_url: {
            $concat: [
              `${process.env.APP_URL}/`,
              { $replaceAll: { input: "$banner_url", find: "\\", replacement: "/" } }
            ]
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }
    ]);
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

  public async createMultiple(playlists: any = [], userId: string): Promise<any> {
    let data = {
      countSuccess: 0,
      countFail: 0,
      messageErrors: [] as string[]
    };
    for (let index = 0; index < playlists.length; index++) {
        try {
            playlists[index].user_id = new Types.ObjectId(userId);
            const members = playlists[index].members || [];
            playlists[index].members = Array.isArray(members) ? members : JSON.parse(members || '[]');
            if (playlists[index].members.length > 0) {
               for (let j = 0; j < playlists[index].members.length; j++) {
                  const artist = await User.findOne({ name: playlists[index].members[j], role: 'artist' });
                  if (artist) {
                    playlists[index].members[j] = new Types.ObjectId(artist._id);
                  } else {
                    const dataUser = {
                      name: playlists[index].members[j],
                      email: `artist${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`,
                      image_url:  `https://icotar.com/initials/${playlists[index].members[j].charAt(0).toUpperCase()}.png`,
                      password: '123456',
                      isActive: true,
                      role: 'artist'
                    }
                    User.create(dataUser).then((newArtist) => {
                      playlists[index].members[j] = new Types.ObjectId(newArtist._id);
                    });
                  }
               }
            }
            playlists[index].banner_url = playlists[index].banner_url || `?url=https://picsum.photos/600/400`;
            const payListByName = await this.model.findOne({ name: playlists[index].name });
            if (payListByName) {
              console.error(`Playlist with name "${playlists[index].name}" already exists. Skipping...`);
              continue; // Skip to the next iteration
            }
            const results = await this.createPlaylist(playlists[index]);
            data.countSuccess += 1;
        } catch (error) {
            console.error(`Failed to create playlist at index ${index}:`, error);
            data.countFail += 1;
            data.messageErrors.push(`Index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    return data;
  }
}

const playListService = new PlayListService();
export { playListService };
