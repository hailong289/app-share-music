import { body } from 'express-validator';
import BaseRequest from './base.request';


class LoginRequest extends BaseRequest {
  constructor() {
    super(LoginRequest.rule);
  }
  // Xử lý lỗi xác thực
  public static rule() {
    return [
      body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),

      body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
        .trim(),
    ];
  }
}

const loginRequest = new LoginRequest();

export default loginRequest;
