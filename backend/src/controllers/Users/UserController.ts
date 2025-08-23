import { userService } from "@/services";
import { BaseController } from "../BaseController";


class UserController extends BaseController {
    public getArtist = this.asyncHandler(async (req, res) => {
        const artists = await userService.getArtist(req.query);
        return this.sendSuccess(res, artists);
    });
}


export default new UserController();
