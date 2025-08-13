import { songService } from "@/services/music/SongService";
import { BaseController } from "../BaseController";
import { Request } from "express";

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
      const song = await songService.createSong({
        ...data,
        user_id: req.body.user_id || req.user?.id,
      });
      return this.sendCreated(res, song);
    } catch (error) {
      if (req.file && req.file.path) {
        try {
          const fs = require('fs');
          fs.unlinkSync(req.file.path);
        } catch (error) {
          console.error('Error cleaning up uploaded file:', error);
        }
      }
      return this.sendError(res, 'Tạo bài hát thất bại', 400);
    }
  });

  /**
   * Update song by ID
   * @route PUT /songs/:id
   */
  public update = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const song = await songService.updateSongById(id, data);
    if (!song) {
      return this.sendNotFound(res);
    }
    return this.sendSuccess(res, song, 'Cập nhật bài hát thành công');
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

}

export default new SongController();