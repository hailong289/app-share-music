import { IComment, ISong } from "@/types/music.types";
import { BaseService } from "../BaseService";
import { Comment, ListeningHistory, Playlist, PlaylistSong, Song, User } from "@/models";
import * as fs from "fs";
import ArtistSong from "@/models/ArtistSong";
import { Types } from "mongoose";
import { pipeline } from "stream";

class SongService extends BaseService<ISong> {
  constructor() {
    super(Song);
  }

  /**
   * Create a new song
   * @param data - Song data
   */
  public async createSong(data: Partial<ISong & { artist_names?: string; artist_ids?: string[]; playlist_id?: string }>): Promise<ISong> {
    const playListId = data.playlist_id ?? null;
    data.playlist_id && delete data.playlist_id;
    const playlist = await Playlist.findById(playListId ? new Types.ObjectId(playListId) : null);
    data.banner_url = data.banner_url ?? playlist?.banner_url ?? '';
    const song = await this.create(data);

    if (data.artist_ids && Array.isArray(data.artist_ids)) {
      // Handle artist_ids if needed
      for (const artistId of data.artist_ids) {
        await ArtistSong.create({ artist_id: new Types.ObjectId(artistId), song_id: song.id });
      }
    } else if (data.artist_names) {
      const artistNames = data.artist_names.split(',').map(name => name.trim()).filter(name => name.length > 0);
      for (const name of artistNames) {
        let artist = await User.findOne({ name: name, role: 'artist' });
        if (!artist) {
          artist = await User.create({ name: name, role: 'artist', email: `${name.replace(/\s+/g, '_').toLowerCase()}@example.com`, password: 'defaultpassword' });
        }
        await ArtistSong.create({ artist_id: artist.id, song_id: song.id });
      }
    }
    if (playListId) {

      if (playlist) {
        await PlaylistSong.create({ playlist_id: playlist.id, song_id: song.id, order: playlist.total_songs + 1 });
      }
    }
    return song;
  }

  /**
   * Find song by ID
   * @param id - Song ID
   */
  public async findSongById(id: string): Promise<ISong | null> {
    const songs = await this.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'artistsongs',
          let: { songId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$song_id', '$$songId'] } } },
            {
              $lookup: {
                from: 'users',
                localField: 'artist_id',
                foreignField: '_id',
                as: 'artist'
              }
            },
            { $unwind: { path: '$artist', preserveNullAndEmptyArrays: false } },
            { $replaceRoot: { newRoot: '$artist' } },
            {
              $addFields: {
                image_url: {
                  $cond: [
                    { $regexMatch: { input: { $toString: "$image_url" }, regex: /^https?:\/\// } },
                    { $replaceAll: { input: { $toString: "$image_url" }, find: "\\", replacement: "/" } },
                    {
                      $concat: [
                        `${process.env.APP_URL}/`,
                        { $replaceAll: { input: { $toString: "$image_url" }, find: "\\", replacement: "/" } }
                      ]
                    }
                  ]
                }
              }
            }
          ],
          as: 'artists'
        }
      },
      {
        $addFields: {
          banner_url: {
            $cond: [
              { $regexMatch: { input: { $toString: "$banner_url" }, regex: /^https?:\/\// } },
              { $replaceAll: { input: { $toString: "$banner_url" }, find: "\\", replacement: "/" } },
              {
                $concat: [
                  `${process.env.APP_URL}/`,
                  { $replaceAll: { input: { $toString: "$banner_url" }, find: "\\", replacement: "/" } }
                ]
              }
            ]
          },
          audio_url: {
            $cond: [
              { $regexMatch: { input: { $toString: "$audio_url" }, regex: /^https?:\/\// } },
              { $replaceAll: { input: { $toString: "$audio_url" }, find: "\\", replacement: "/" } },
              {
                $concat: [
                  `${process.env.APP_URL}/`,
                  { $replaceAll: { input: { $toString: "$audio_url" }, find: "\\", replacement: "/" } }
                ]
              }
            ]
          }
        }
      }
    ]);
    return songs.length > 0 ? songs[0] : null;
  }

  /**
   * Find one song by filter
   * @param filter - Filter query
   */
  public async findOneSong(filter: Record<string, any>): Promise<ISong | null> {
    return await this.findOne(filter);
  }

  /**
   * Find multiple songs
   * @param filter - Filter query
   */
  public async findSongs(filter: Record<string, any> = {}): Promise<ISong[]> {
    const { page = null, limit = null, search = '' } = filter;
    if (page && limit) {
      const result = await this.model.aggregate([
        {
          $lookup: {
            from: 'artistsongs',
            let: { songId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$song_id', '$$songId'] } } },
              {
                $lookup: {
                  from: 'users',
                  localField: 'artist_id',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $addFields: {
                        image_url: {
                          $cond: [
                            { $regexMatch: { input: { $toString: "$image_url" }, regex: /^https?:\/\// } },
                            { $replaceAll: { input: { $toString: "$image_url" }, find: "\\", replacement: "/" } },
                            {
                              $concat: [
                                `${process.env.APP_URL}/`,
                                { $replaceAll: { input: { $toString: "$image_url" }, find: "\\", replacement: "/" } }
                              ]
                            }
                          ]
                        }
                      }
                    }
                  ],
                  as: 'artist'
                }
              },
              { $unwind: { path: '$artist', preserveNullAndEmptyArrays: false } },
              { $replaceRoot: { newRoot: '$artist' } }
            ],
            as: 'artists'
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: (Number(page) - 1) * Number(limit) },
        { $limit: Number(limit) },
        { $match: { title: { $regex: search, $options: 'i' } } },
      ]);
      return await this.convertObject(result);
    }
    const result = await this.aggregate([
      {
        $lookup: {
          from: 'artistsongs',
          let: { songId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$song_id', '$$songId'] } } },
            {
              $lookup: {
                from: 'users',
                localField: 'artist_id',
                foreignField: '_id',
                pipeline: [
                  {
                    $addFields: {
                      image_url: {
                        $cond: [
                          { $regexMatch: { input: { $toString: "$image_url" }, regex: /^https?:\/\// } },
                          { $replaceAll: { input: { $toString: "$image_url" }, find: "\\", replacement: "/" } },
                          {
                            $concat: [
                              `${process.env.APP_URL}/`,
                              { $replaceAll: { input: { $toString: "$image_url" }, find: "\\", replacement: "/" } }
                            ]
                          }
                        ]
                      }
                    }
                  }
                ],
                as: 'artist'
              }
            },
            { $unwind: { path: '$artist', preserveNullAndEmptyArrays: false } },
            { $replaceRoot: { newRoot: '$artist' } }
          ],
          as: 'artists'
        }
      },
      { $sort: { createdAt: -1 } },
      { $match: { title: { $regex: search, $options: 'i' } } },
    ]);
    return await this.convertObject(result);
  }

  /**
   * Update song by ID
   * @param id - Song ID
   * @param update - Update data
   */
  public async updateSongById(id: string, update: Partial<ISong & { artist_ids?: string[] }>): Promise<ISong | null> {
    const song = await this.updateById(id, update);
    if (!song) {
      throw new Error('Song not found');
    }
    if (update.artist_ids && Array.isArray(update.artist_ids)) {
      // Handle artist_ids if needed
      for (const artistId of update.artist_ids) {
        await ArtistSong.create({ artist_id: artistId, song_id: song.id });
      }
    }
    return song;
  }

  /**
   * Delete song by ID
   * @param id - Song ID
   */
  public async deleteSongById(id: string): Promise<ISong | null> {
    const song = await this.findById(id);
    if (!song) {
      return null; // Song not found
    }
    // Clean up audio file if it exists
    if (song.audio_url) {
      try {
        fs.unlinkSync(song.audio_url); // Assuming audio_url is the path to the song file
      } catch (err) {
        // Handle error (e.g., file not found), optionally log it
      }
    }
    return await this.deleteById(id);
  }

  public async playSong(id: string, user_id: string): Promise<ISong | null> {
    const song = await this.findById(id);
    if (!song) {
      return null; // Song not found
    }
    // Logic to play the song (e.g., streaming the audio)
    await ListeningHistory.create({
      user_id: user_id,
      song_id: song.id
    });
    return song;
  }

  public async commentSong(id: string, user_id: string, content: string): Promise<IComment | null> {
    const song = await this.findById(id);
    if (!song) {
      return null; // Song not found
    }
    const comment = await Comment.create({
      user_id: user_id,
      song_id: song.id,
      content: content
    });
    return comment;
  }

  public async findSongsByArtistId(artistId: string) {
    const artist = await User.findById(artistId);
    if (!artist) {
      return []; // Artist not found
    }
    const artistSong = await ArtistSong.find({ artist_id: artistId });
    return {
      ...artist.toObject(),
      songs: await this.find({
        _id: { $in: artistSong.map(as => as.song_id) }
      })
    };
  }

}

const songService = new SongService();
export { SongService, songService };
