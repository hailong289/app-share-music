import { songService } from "@/services/music/SongService";
import { BaseController } from "../BaseController";

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
    const song = await songService.createSong(data);
    return this.sendCreated(res, song);
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
      return this.sendNotFound(res);
    }
    return this.sendSuccess(res, '', 'Xóa bài hát thành công');
  });

}

export default new SongController();