import { IAlbum } from "@/types/music.types";
import { BaseService } from "../BaseService";
import { Album } from "@/models";

class AlbumService extends BaseService<IAlbum> {
  constructor() {
    super(Album);
  }
  
  getListAlBums = async (filter: Record<string, any> = {}, options: Record<string, any> = {}) => {
    return await this.find(filter, options);
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
    return await this.findById(id);
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

}

const albumService = new AlbumService();

export { AlbumService, albumService };