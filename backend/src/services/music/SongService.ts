import { IComment, ISong } from "@/types/music.types";
import { BaseService } from "../BaseService";
import { Comment, ListeningHistory, Song } from "@/models";
import * as fs from "fs";

class SongService extends BaseService <ISong> {
  constructor() {
    super(Song);
  }

  /**
   * Create a new song
   * @param data - Song data
   */
  public async createSong(data: Partial<ISong>): Promise<ISong> {
    return await this.create(data);
  }

  /**
   * Find song by ID
   * @param id - Song ID
   */
  public async findSongById(id: string): Promise<ISong | null> {
    return await this.findById(id);
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
  public async updateSongById(id: string, update: Partial<ISong>): Promise<ISong | null> {
    return await this.updateById(id, update);
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

}

const songService = new SongService();
export { SongService, songService };
