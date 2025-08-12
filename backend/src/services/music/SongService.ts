import { ISong } from "@/types/music.types";
import { BaseService } from "../BaseService";
import { Song } from "@/models";

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
    return await this.find(filter);
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
    return await this.deleteById(id);
  }

}

const songService = new SongService();
export { SongService, songService };