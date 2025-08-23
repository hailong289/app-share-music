import { ISong } from "@/types/music.types";
import { BaseService } from "../BaseService";
import { ListeningHistory, Song, User } from "@/models";
import * as fs from "fs";
import ArtistSong from "@/models/ArtistSong";
import { Types } from "mongoose";

class SongService extends BaseService <ISong> {
  constructor() {
    super(Song);
  }

  /**
   * Create a new song
   * @param data - Song data
   */
  public async createSong(data: Partial<ISong & { artist_ids?: string[] }>): Promise<ISong> {
    const song = await this.create(data);
    if (data.artist_ids && Array.isArray(data.artist_ids)) {
      // Handle artist_ids if needed
      for (const artistId of data.artist_ids) {
        await ArtistSong.create({ artist_id: artistId, song_id: song.id });
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
          from: "artistsongs",
          localField: "_id",
          foreignField: "song_id",
          as: "artist_songs"
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
    if (filter.page && filter.limit) {
      const { page, limit } = filter;
      return await this.model.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    }
    return await this.find({});
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

  public async findSongsByArtistId(artistId: string): Promise<ISong[]> {
    const artist = await User.findById(artistId);
    if (!artist) {
      return []; // Artist not found
    }
    const artistSong = await ArtistSong.find({ artist_id: artistId });
    return await this.find({
      _id: { $in: artistSong.map(as => as.song_id) }
    });
  }

}

const songService = new SongService();
export { SongService, songService };
