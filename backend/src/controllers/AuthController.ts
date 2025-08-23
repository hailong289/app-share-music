import { JWTUtil, JWTPayload } from './../utils/jwt';
import { userService } from "@/services/UserService";
import { BaseController } from "./BaseController";
import { validationResult } from "express-validator/lib/validation-result";
import { pick } from '@/utils/data';
import OtpService from '@/services/OtpService';
import { appQueue } from '@/queues';
import EmailJob from '@/queues/jobs/EmailJob';

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
                tokens: await JWTUtil.createTokenJwt(pick(result.user, ['id', 'email', 'name', 'role']) as JWTPayload),
                user: result.user
            }, 'Đăng nhập thành công');
        } catch (error) {
            console.error('Login error:', error);
            return this.sendError(res, 'Đăng nhập thất bại', 400);
        }
    });

    public register = this.asyncHandler(async (req, res) => {
        try {
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

    public sendOtp = this.asyncHandler(async (req, res) => {
        const { email } = req.body;
        const otp = await OtpService.createOtp(email);
        if (!otp) {
            return this.sendError(res, 'Gửi OTP thất bại', 400);
        }
        await appQueue.addJob(EmailJob, {
            to: email,
            subject: 'Xác thực OTP',
            body: `Mã OTP của bạn là: ${otp}. Nó sẽ hết hạn sau 5 phút.`
        });
        // Gửi phản hồi thành công
        return this.sendSuccess(res, {}, 'Gửi OTP thành công vui lòng kiểm tra email của bạn, mã OTP sẽ hết hạn sau 5 phút');
    });

    public verifyOtp = this.asyncHandler(async (req, res) => {
        const { email, otp } = req.body;
        const result = await OtpService.verifyOtp(email, otp);
        if (!result) {
            return this.sendError(res, 'Mã OTP không hợp lệ hoặc đã hết hạn', 400);
        }
        return this.sendSuccess(res, {}, 'Xác thực OTP thành công');
    });
}

export default new AuthController();
