
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

class LoginRequest {
    public static validate() {
        return [
            body('email')
                .isEmail().withMessage('Email không hợp lệ')
                .normalizeEmail(),
            body('password')
                .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
                .trim()
        ];
    }
    /**
     * Xử lý lỗi xác thực
     */
    public static handleValidationErrors(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array().map(err => ({
                    field: err.type === 'field' ? err.path : undefined,
                    message: err.msg
                }))
            });
        }
        next();
    }
}

export default LoginRequest;
