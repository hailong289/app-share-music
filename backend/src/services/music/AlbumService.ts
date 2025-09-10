import { IAlbum } from "@/types/music.types";
import { BaseService } from "../BaseService";
import { Album } from "@/models";
import AlbumSong from "@/models/AlbumSong";
import { Types } from "mongoose";

class AlbumService extends BaseService<IAlbum> {
  constructor() {
    super(Album);
  }

  getListAlBums = async (filter: Record<string, any> = {}, options: Record<string, any> = {}) => {
    if (filter.page && filter.limit) {
      const { page, limit } = filter;
      return await this.model.aggregate([
        { $skip: (Number(page) - 1) * Number(limit) },
        { $limit: Number(limit) },
        {
          $lookup: {
            from: "users",
            localField: "artist_id",
            foreignField: "_id",
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
                          { $replaceAll: { input: "$image_url", find: "\\", replacement: "/" } }
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: "artist"
          }
        },
        { $unwind: "$artist" },
        {
          $addFields: {
            cover_url: {
              $cond: [
                { $regexMatch: { input: { $toString: "$cover_url" }, regex: /^https?:\/\// } },
                { $replaceAll: { input: { $toString: "$cover_url" }, find: "\\", replacement: "/" } },
                {
                  $concat: [
                    `${process.env.APP_URL}/`,
                    { $replaceAll: { input: "$cover_url", find: "\\", replacement: "/" } }
                  ]
                }
              ]
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ])
    }
    return await this.model.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "artist_id",
          foreignField: "_id",
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
                        { $replaceAll: { input: "$image_url", find: "\\", replacement: "/" } }
                      ]
                    }
                  ]
                }
              }
            }
          ],
          as: "artist"
        }
      },
      { $unwind: "$artist" },
      {
        $addFields: {
          cover_url: {
            $cond: [
              { $regexMatch: { input: { $toString: "$cover_url" }, regex: /^https?:\/\// } },
              { $replaceAll: { input: { $toString: "$cover_url" }, find: "\\", replacement: "/" } },
              {
                $concat: [
                  `${process.env.APP_URL}/`,
                  { $replaceAll: { input: "$cover_url", find: "\\", replacement: "/" } }
                ]
              }
            ]
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
  }

  /**
   * Create a new album
   * @param data - Album data
   */
  public async createAlbum(data: Partial<IAlbum>): Promise<IAlbum> {
    return await this.create(data);
  }

  /**
   * Find album by ID
   * @param id - Album ID
   */
  public async findAlbumById(id: string): Promise<IAlbum | null> {
    const album = await this.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: "albumsongs",
          let: { pid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$album_id", "$$pid"] } } },
            {
              $lookup: {
                from: "songs",
                localField: "song_id",
                foreignField: "_id",
                as: "song"
              }
            },
            { $unwind: "$song" },
            { $replaceWith: "$song" },
            {
              $addFields: {
                banner_url: {
                  $concat: [
                    `${process.env.APP_URL}/`,
                    { $replaceAll: { input: "$banner_url", find: "\\", replacement: "/" } }
                  ]
                },
                audio_url: {
                  $concat: [
                    `${process.env.APP_URL}/`,
                    { $replaceAll: { input: "$audio_url", find: "\\", replacement: "/" } }
                  ]
                }
              }
            }
          ],
          as: "songs"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "artist_id",
          foreignField: "_id",
          as: "artist"
        }
      },
      { $unwind: "$artist" },
      {
        $addFields: {
          cover_url: {
            $concat: [
              `${process.env.APP_URL}/`,
              { $replaceAll: { input: "$cover_url", find: "\\", replacement: "/" } }
            ]
          }
        }
      }
    ]);
    return album[0] ?? null;
  }

  /**
   * Find one album by filter
   * @param filter - Filter query
   */
  public async findOneAlbum(filter: Record<string, any>): Promise<IAlbum | null> {
    return await this.findOne(filter);
  }

  public async update(id: string, update: Partial<IAlbum>): Promise<IAlbum | null> {
    return await this.updateById(id, update);
  }

  /**
   * Delete album by ID
   * @param id - Album ID
   */
  public async deleteAlbumById(id: string): Promise<IAlbum | null> {
    return await this.deleteById(id);
  }

  public async findAlbumsByArtistId(artistId: string): Promise<IAlbum[]> {
    return await this.find({ artist_id: artistId });
  }

  public async addSongToAlbum(albumId: string, songId: string): Promise<IAlbum | null> {
    const albumSongs = await AlbumSong.create({
      album_id: albumId,
      song_id: songId
    });
    if (!albumSongs) {
      throw new Error("Failed to add song to album");
    }
    return this.findAlbumById(albumId);
  }

  public async addSongsToAlbum(albumId: string, songIds: string[]): Promise<IAlbum | null> {
    const albumSongs = await AlbumSong.insertMany(
      songIds.map(songId => ({ album_id: albumId, song_id: songId }))
    );
    if (!albumSongs || albumSongs.length === 0) {
      throw new Error("Failed to add songs to album");
    }
    return this.findAlbumById(albumId);
  }

}

const albumService = new AlbumService();

export { AlbumService, albumService };
