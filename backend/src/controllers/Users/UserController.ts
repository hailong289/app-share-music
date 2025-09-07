import { userService } from "@/services";
import { BaseController } from "../BaseController";
import { uploadService } from "@/services/UploadService";
import { slug } from "@/utils/data";


class UserController extends BaseController {
  public getArtist = this.asyncHandler(async (req, res) => {
    const artists = await userService.getArtist(req.query);
    return this.sendSuccess(res, artists);
  });
  public updateMe = this.asyncHandler(async (req: any, res) => {
    const userId = req.user.id;
    const updateData = req.body;
    if (req.files && Array.isArray(req.files)) {
      updateData.files.forEach((itemFile: Express.Multer.File) => {
        const filePath = uploadService.uploadSingle(itemFile, slug(updateData.name, '_'), slug(req.user?.name || ''));
        updateData[itemFile.fieldname] = filePath;
      });
    }
    const updatedUser = await userService.updateUser(userId, updateData);
    if (!updatedUser) {
      return this.sendNotFound(res, 'Người dùng không tồn tại');
    }
    return this.sendSuccess(res, updatedUser, 'Cập nhật thông tin người dùng thành công');
  });
}


export default new UserController();
