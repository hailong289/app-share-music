import { playListService } from "@/services/music/PlayListService";
import { BaseController } from "../BaseController";

class PlaylistController extends BaseController {

  /**
   * Get playlists by user ID
   * @route GET /playlists/user/:userId
   */
  public getPlaylistsByUserId = this.asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const playlists = await playListService.getPlaylistsByUserId(userId);
    return this.sendSuccess(res, playlists);
  });

  /**
   * Create a new playlist
   * @route POST /playlists
   */
  public create = this.asyncHandler(async (req, res) => {
    const playlistData = req.body;
    const playlist = await playListService.createPlaylist(playlistData);
    return this.sendCreated(res, playlist);
  });

  /**
   * Update playlist by ID
   * @route PUT /playlists/:playlistId
   */
  public update = this.asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const updateData = req.body;
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


}

export default new PlaylistController();
