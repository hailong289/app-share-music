import { userService } from "@/services";
import { BaseController } from "../BaseController";
import { uploadService } from "@/services/UploadService";
import { pick, slug } from "@/utils/data";
import { JWTPayload, JWTUtil } from "@/utils/jwt";


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

  public createArtist = this.asyncHandler(async (req: any, res) => {
    try {
      const { name, email, password, bio } = req.body;
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach((itemFile: Express.Multer.File) => {
          if (itemFile.fieldname !== 'image_url') return;
          const filePath = uploadService.uploadSingle(itemFile, slug(name, '_'), slug(req.user?.name || ''));
          req.body[itemFile.fieldname] = filePath;
        });
      }
      const result = await userService.createUser({
        name,
        email,
        password,
        bio: bio || '',
        image_url: req.body.image_url || `https://icotar.com/initials/${name.charAt(0).toUpperCase()}.png`,
        role: 'artist',
        isActive: true
      });
      if (!result.status || !result.user) {
        return this.sendError(res, result.msg || 'Tạo nghệ sĩ thất bại', 400);
      }
      return this.sendCreated(res, {
        tokens: await JWTUtil.createTokenJwt(pick(result.user, ['id', 'email', 'name']) as JWTPayload),
        user: result.user
      }, 'Tạo nghệ sĩ thành công');
    } catch (error) {
      console.error('Registration error:', error);
      return this.sendError(res, 'Tạo nghệ sĩ thất bại', 400);
    }
  });

  public updateArtist = this.asyncHandler(async (req: any, res) => {
    try {
      const artistId = req.params.id;
      const updateData = req.body;
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach((itemFile: Express.Multer.File) => {
          if (itemFile.fieldname !== 'image_url') return;
          const filePath = uploadService.uploadSingle(itemFile, slug(updateData.name, '_'), slug(req.user?.name || ''));
          updateData[itemFile.fieldname] = filePath;
        });
      }
      const updatedArtist = await userService.updateUser(artistId, updateData);
      if (!updatedArtist) {
        return this.sendNotFound(res, 'Nghệ sĩ không tồn tại');
      }
      return this.sendSuccess(res, updatedArtist, 'Cập nhật thông tin nghệ sĩ thành công');
    } catch (error) {
      console.error('Update artist error:', error);
      return this.sendError(res, 'Cập nhật nghệ sĩ thất bại', 400);
    }
  });

  public deleteArtist = this.asyncHandler(async (req, res) => {
    try {
      const artistId = req.params.id;
      const deleted = await userService.deleteArtist(artistId);
      if (!deleted) {
        return this.sendNotFound(res, 'Nghệ sĩ không tồn tại');
      }
      return this.sendSuccess(res, null, 'Xoá nghệ sĩ thành công');
    } catch (error) {
      console.error('Delete artist error:', error);
      return this.sendError(res, 'Xoá nghệ sĩ thất bại', 400);
    }
  });
}


export default new UserController();
