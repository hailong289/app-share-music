import { sessionsService } from "@/services/music/SessionsService";
import { BaseController } from "../BaseController";

class SessionsController extends BaseController {

  public index = this.asyncHandler(async (req, res) => {
    const sessions = await sessionsService.getSessions();
    return this.sendSuccess(res, sessions, 'Lấy danh sách phiên thành công');
  });

  public create = this.asyncHandler(async (req, res) => {
    const sessionData = req.body;
    const session = await sessionsService.createSession(sessionData);
    return this.sendCreated(res, session, 'Tạo phiên thành công');
  });

  public show = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const session = await sessionsService.getSessionById(id);
    if (!session) {
      return this.sendNotFound(res, 'Phiên không tồn tại');
    }
    return this.sendSuccess(res, session, 'Lấy phiên thành công');
  });

  public update = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const updatedSession = await sessionsService.updateSession(id, updateData);
    if (!updatedSession) {
      return this.sendNotFound(res, 'Phiên không tồn tại');
    }
    return this.sendSuccess(res, updatedSession, 'Cập nhật phiên thành công');
  });

  public delete = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedSession = await sessionsService.deleteSession(id);
    if (!deletedSession) {
      return this.sendNotFound(res, 'Phiên không tồn tại');
    }
    return this.sendSuccess(res, deletedSession, 'Xóa phiên thành công');
  });

  public createSessionItem = this.asyncHandler(async (req, res) => {
    const sessionItemData = req.body;
    const sessionItem = await sessionsService.createSessionItem(sessionItemData);
    return this.sendCreated(res, sessionItem, 'Tạo mục phiên thành công');
  });

  public getSessionItems = this.asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const sessionItems = await sessionsService.getSessionItems(sessionId);
    if (!sessionItems) {
      return this.sendNotFound(res, 'Không tìm thấy mục phiên');
    }
    return this.sendSuccess(res, sessionItems, 'Lấy mục phiên thành công');
  });

  public deleteSessionItem = this.asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const deletedItem = await sessionsService.deleteSessionItem(itemId);
    if (!deletedItem) {
      return this.sendNotFound(res, 'Mục phiên không tồn tại');
    }
    return this.sendSuccess(res, deletedItem, 'Xóa mục phiên thành công');
  });

  public updateSessionItem = this.asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const updateData = req.body;
    const updatedItem = await sessionsService.updateSessionItem(itemId, updateData);
    if (!updatedItem) {
      return this.sendNotFound(res, 'Mục phiên không tồn tại');
    }
    return this.sendSuccess(res, updatedItem, 'Cập nhật mục phiên thành công');
  });
}



export default new SessionsController();
