import { albumService } from "@/services/music/AlbumService";
import { BaseController } from "../BaseController";

class AlbumController extends BaseController {
  /**
   * Get album list
   * @route GET /albums
   */
  public index = this.asyncHandler(async (req, res) => {
    const filter = req.query || {};
    const options = { sort: { created_at: -1 } };
    const albums = await albumService.getListAlBums(filter, options);
    return this.sendSuccess(res, albums);
  });
  /**
   * Get album by ID
   * @route GET /albums/:id
   */
  public show = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const album = await albumService.findAlbumById(id);
    if (!album) {
      return this.sendNotFound(res, "Album not found");
    }
    return this.sendSuccess(res, album);
  });

  /**
   * Create a new album
   * @route POST /albums
   */
  public create = this.asyncHandler(async (req, res) => {
    const data = req.body;
    const album = await albumService.createAlbum(data);
    return this.sendCreated(res, album);
  });

  /**
   * Update album by ID
   * @route PUT /albums/:id
   */
  public update = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const album = await albumService.update(id, data);
    if (!album) {
      return this.sendNotFound(res, "Album not found");
    }
    return this.sendSuccess(res, album);
  });

  /**
   * Delete album by ID
   * @route DELETE /albums/:id
   */
  public delete = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const album = await albumService.deleteAlbumById(id);
    if (!album) {
      return this.sendNotFound(res, "Album not found");
    }
    return this.sendSuccess(res, { message: "Album deleted successfully" });
  });

  /**
   * Get albums by artist ID
   * @route GET /albums/artist/:artistId
   */
  public getAlbumsByArtistId = this.asyncHandler(async (req, res) => {
    const { artistId } = req.body;
    const albums = await albumService.findAlbumsByArtistId(artistId);
    if (albums.length === 0) {
      return this.sendNotFound(res, "No albums found for this artist");
    }
    return this.sendSuccess(res, albums);
  });


}

export default new AlbumController();