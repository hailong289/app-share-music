import { playListService } from "@/services/music/PlayListService";
import { BaseController } from "../BaseController";
import { uploadService } from "@/services/UploadService";
import { slug } from "@/utils/data";

class PlaylistController extends BaseController {

  /**
   * Get all playlists
   * @route GET /playlists
   */
  public index = this.asyncHandler(async (req, res) => {
    const playlists = await playListService.getAllPlaylists(req.query);
    return this.sendSuccess(res, playlists, 'Lấy danh sách playlist thành công');
  });


  /**
   * Get playlists by user ID
   * @route GET /playlists/user/:userId
   */
  public getPlaylistsByUserId = this.asyncHandler(async (req, res) => {
    const playlists = await playListService.getPlaylistsByUserId(req.user.id);
    return this.sendSuccess(res, playlists);
  });

  /**
   * Create a new playlist
   * @route POST /playlists
   */
  public create = this.asyncHandler(async (req: any, res) => {
    const data = req.body;
    try {
      (data.files || []).forEach((itemFile: Express.Multer.File) => {
        if (itemFile.fieldname !== 'banner_url') {
          return this.sendError(res, 'Invalid file field name', 400);
        }
        const filePath = uploadService.uploadSingle(itemFile, slug(data.name, '_'), slug(req.user?.name || ''));
        data[itemFile.fieldname] = filePath;
      });
    } catch (error) {
      if (req.file && req.file.path) {
        uploadService.removeFile(req.file.path); // Clean up uploaded file on error
      }
      return this.sendError(res, error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo playlist');
    }
    const playlist = await playListService.createPlaylist(data);
    return this.sendCreated(res, playlist);
  });

  /**
   * Update playlist by ID
   * @route PUT /playlists/:playlistId
   */
  public update = this.asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const updateData = req.body;
    try {
      const playList = await playListService.getPlaylistById(playlistId);
      if (!playList) {
        return this.sendNotFound(res);
      }
      (updateData.files || []).forEach((itemFile: Express.Multer.File) => {
        if (itemFile.fieldname !== 'banner_url') {
          return this.sendError(res, 'Invalid file field name', 400);
        }
        const filePath = uploadService.uploadSingle(itemFile, slug(updateData.name, '_'), slug(req.user?.name || ''));
        updateData[itemFile.fieldname] = filePath;
      });
    } catch (error) {
      if (req.file && req.file.path) {
        uploadService.removeFile(req.file.path); // Clean up uploaded file on error
      }
      return this.sendError(res, error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo playlist');
    }
    const updatedPlaylist = await playListService.updatePlaylist(playlistId, updateData);
    if (!updatedPlaylist) {
      return this.sendNotFound(res);
    }
    return this.sendSuccess(res, updatedPlaylist, 'Cập nhật playlist thành công');
  });

  /**
   * Delete playlist by ID
   * @route DELETE /playlists/:playlistId
   */
  public delete = this.asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const deletedPlaylist = await playListService.deletePlaylist(playlistId);
    if (!deletedPlaylist) {
      return this.sendNotFound(res);
    }
    return this.sendSuccess(res, deletedPlaylist, 'Xóa playlist thành công');
  });

  /**
   * Get playlist by ID
   * @route GET /playlists/:playlistId
   */
  public show = this.asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const playlist = await playListService.getPlaylistById(playlistId);
    if (!playlist) {
      return this.sendNotFound(res);
    }
    return this.sendSuccess(res, playlist);
  });


  public addSong = this.asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    try {
      const result = await playListService.addSongToPlaylist(playlistId, req.body);
      return this.sendSuccess(res, result, 'Thêm bài hát vào playlist thành công');
    } catch (error) {
      return this.sendError(res, error instanceof Error ? error.message : 'An error occurred');
    }
  });

  public createMultiple = this.asyncHandler(async (req, res) => {
    try {
      const result = await playListService.createMultiple(req.body.playlists, req.user.id);
      return this.sendSuccess(res, result, 'Thêm nhiều playlist thành công');
    } catch (error) {
      return this.sendError(res, error instanceof Error ? error.message : 'An error occurred');
    }
  });

  public addOrCreateSong = this.asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    try {
      const result = await playListService.addOrCreateSong(playlistId, req.body, req.user.id);
      return this.sendSuccess(res, result, 'Thêm hoặc tạo bài hát vào playlist thành công');
    } catch (error) {
      return this.sendError(res, error instanceof Error ? error.message : 'An error occurred');
    }
  });

  public removeSong = this.asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { songId } = req.body;
    try {
      const result = await playListService.removeSongFromPlaylist(playlistId, songId);
      return this.sendSuccess(res, result, 'Xóa bài hát khỏi playlist thành công');
    } catch (error) {
      return this.sendError(res, error instanceof Error ? error.message : 'An error occurred');
    }
  });

}

export default new PlaylistController();
