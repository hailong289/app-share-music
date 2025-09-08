import { albumService } from "@/services/music/AlbumService";
import { BaseController } from "../BaseController";
import { uploadService } from "@/services/UploadService";
import { slug } from "@/utils/data";

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
    try {
      const data = req.body;
      if (data.files && Array.isArray(data.files) && data.files.length > 0) {
        data.files.forEach((itemFile: Express.Multer.File) => {
          if (itemFile.fieldname !== 'cover_url') {
            throw new Error('Invalid file field name');
          }
          const filePath = uploadService.uploadSingle(itemFile, slug(data.title, '_'), slug(req.user?.name || ''), true);
          data[itemFile.fieldname] = filePath;
        });
      }
      const album = await albumService.createAlbum(data);
      return this.sendCreated(res, album);
    } catch (error) {
      if (req.file && req.file.path) {
        uploadService.removeFile(req.file.path); // Clean up uploaded file on error
      }
      return this.sendError(res, error instanceof Error ? error.message : 'An error occurred while creating the album');
    }
  });

  /**
   * Update album by ID
   * @route PUT /albums/:id
   */
  public update = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const existingAlbum = await albumService.findAlbumById(id);
      if (!existingAlbum) {
        return this.sendNotFound(res, "Album not found");
      }
      if (data.files && Array.isArray(data.files) && data.files.length > 0) {
        data.files.forEach((itemFile: Express.Multer.File) => {
          if (itemFile.fieldname !== 'cover_url') {
            throw new Error('Invalid file field name');
          }
          const filePath = uploadService.uploadSingle(itemFile, slug(existingAlbum.title || '', '_'), slug(req.user?.name || ''), true);
          data[itemFile.fieldname] = filePath;
          uploadService.removeFile(existingAlbum.cover_url); // Clean up old cover if exists
        });
      }
      const album = await albumService.update(id, data);
      if (!album) {
        return this.sendNotFound(res, "Album not found");
      }
      return this.sendSuccess(res, album);
    } catch (error) {
      if (req.file && req.file.path) {
        uploadService.removeFile(req.file.path); // Clean up uploaded file on error
      }
      return this.sendError(res, error instanceof Error ? error.message : 'An error occurred while updating the album');
    }
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

  /**
   * Thêm nhạc vào album
   */
  public addSongToAlbum = this.asyncHandler(async (req, res) => {
    try {
      const album = await albumService.addSongToAlbum(req.params.id, req.body.song_id);
      return this.sendSuccess(res, album);
    } catch (error) {
      return this.sendError(res, error instanceof Error ? error.message : 'An error occurred while adding song to album');
    }
  });

  /**
   * Thêm nhiều bài hát vào album
   */
  public addSongsToAlbum = this.asyncHandler(async (req, res) => {
    try {
      const album = await albumService.addSongsToAlbum(req.params.id, req.body.song_ids);
      return this.sendSuccess(res, album);
    } catch (error) {
      return this.sendError(res, error instanceof Error ? error.message : 'An error occurred while adding songs to album');
    }
  });
}

export default new AlbumController();
