import { JWTUtil, JWTPayload } from './../utils/jwt';
import { userService } from "@/services/UserService";
import { BaseController } from "./BaseController";
import { validationResult } from "express-validator/lib/validation-result";
import { pick } from '@/utils/data';

class AuthController extends BaseController {
    /**
     * Login nè
     */
    public login = this.asyncHandler(async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await userService.login(email, password);
            if (!result.status || !result.user) {
                return this.sendUnauthorized(res, result.msg);
            }
            return this.sendSuccess(res, {
                tokens: await JWTUtil.createTokenJwt(pick(result.user, ['id', 'email', 'name']) as JWTPayload),
                user: result.user
            }, 'Đăng nhập thành công');
        } catch (error) {
            console.error('Login error:', error);
            return this.sendError(res, 'Đăng nhập thất bại', 400);
        }
    });

    public register = this.asyncHandler(async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.sendValidationError(res, errors.array().map(err => ({
                    field: err.type === 'field' ? err.path : undefined,
                    message: err.msg
                })), 'Dữ liệu không hợp lệ');
            }
            const { name, email, password, bio, image_url, role } = req.body;
            const result = await userService.createUser({
                name,
                email,
                password,
                bio: bio || '',
                image_url: image_url || `https://icotar.com/initials/${name.charAt(0).toUpperCase()}.png`,
                role: role || 'user',
                isActive: true
            });
            if (!result.status || !result.user) {
                return this.sendError(res, result.msg || 'Đăng ký thất bại', 400);
            }
            return this.sendCreated(res, {
                tokens: await JWTUtil.createTokenJwt(pick(result.user, ['id', 'email', 'name']) as JWTPayload),
                user: result.user
            }, 'Đăng ký thành công');
        } catch (error) {
            console.error('Registration error:', error);
            return this.sendError(res, 'Đăng ký thất bại', 400);
        }
    });
}

export default new AuthController();