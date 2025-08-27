import { songService } from "@/services/music/SongService";
import { BaseController } from "../BaseController";
import { Request, Response } from "express";
import { uploadService } from "@/services/UploadService";
import { slug } from "@/utils/data";
import logger from "@/utils/logger";

class SongController extends BaseController {
  /**
   * Get song list
   * @route GET /songs
   */
  public index = this.asyncHandler(async (req, res) => {
    const filter = req.query || {};
    const songs = await songService.findSongs(filter);
    return this.sendSuccess(res, songs);
  });

  /**
   * Get song by ID
   * @route GET /songs/:id
   */
  public show = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const song = await songService.findSongById(id);
    if (!song) {
      return this.sendNotFound(res);
    }
    return this.sendSuccess(res, song);
  });

  /**
   * Create a new song
   * @route POST /songs
   */
  public create = this.asyncHandler(async (req, res) => {
    const data = req.body;
    try {
      if (!data.files || !Array.isArray(data.files) || data.files.length === 0) {
        return this.sendError(res, 'No file uploaded', 400);
      }
      data.files.forEach((itemFile: Express.Multer.File) => {
        const filePath = uploadService.uploadSingle(itemFile, slug(data.title, '_'), slug(req.user?.name || ''));
        data[itemFile.fieldname] = filePath;
      });
      delete data.files; // Remove files from data to avoid duplication
      const song = await songService.createSong({
        ...data,
        user_id: req.body.user_id || req.user?.id
      });
      return this.sendCreated(res, song);
    } catch (error) {
      logger.error('Error creating song:', error);
      if (req.file && req.file.path) {
         uploadService.removeFile(req.file.path); // Clean up uploaded file on error
      }
      return this.sendError(res, 'Tạo bài hát thất bại', 400, {
        message: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  });

  /**
   * Update song by ID
   * @route PUT /songs/:id
   */
  public update = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
       const song = await songService.findSongById(id);
       if (!song) {
         return this.sendNotFound(res);
       }
       if (data.files && Array.isArray(data.files) && data.files.length > 0) {
         data.files.forEach((itemFile: Express.Multer.File) => {
           const filePath = uploadService.uploadSingle(itemFile, slug(data.title, '_'), slug(req.user?.name || ''));
           data[itemFile.fieldname] = filePath;
           uploadService.removeFile((song as any)[itemFile.fieldname]); // Clean up old file
         });
       }
       const updatedSong = await songService.updateSongById(id, data);
       return this.sendSuccess(res, updatedSong, 'Cập nhật bài hát thành công');
    } catch (error) {
      logger.error('Error updating song:', error);
      if (req.file && req.file.path) {
        uploadService.removeFile(req.file.path); // Clean up uploaded file on error
      }
      return this.sendError(res, 'Cập nhật bài hát thất bại', 400, {
        message: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  });

  /**
   * Delete song by ID
   * @route DELETE /songs/:id
   */
  public delete = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const song = await songService.deleteSongById(id);
    if (!song) {
      return this.sendNotFound(res, 'Bài hát không tồn tại');
    }
    return this.sendSuccess(res, '', 'Xóa bài hát thành công');
  });

  /**
   * Lưu lịch sử nghe bài hát
   */
  public playSong = this.asyncHandler(async (req: Request, res) => {
    const { id } = req.params;
    const userId = req.user?.id || req.body.user_id || '';
    const song = await songService.playSong(id, userId);
    if (!song) {
      return this.sendNotFound(res);
    }
    return this.sendSuccess(res, song);
  });

  /**
   * comment
   */
  public comment = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id || req.body.user_id || '';
    const { content } = req.body;
    const comment = await songService.commentSong(id, userId, content);
    if (!comment) {
      return this.sendNotFound(res);
    }
    return this.sendSuccess(res, comment);
  });

  /**
   * Get songs by artist ID
   */
  public getSongsByArtistId = this.asyncHandler(async (req, res) => {
    const { artistId } = req.params;
    const songs = await songService.findSongsByArtistId(artistId);
    return this.sendSuccess(res, songs);
  });

}

export default new SongController();
