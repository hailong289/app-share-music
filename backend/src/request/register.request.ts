import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import BaseRequest from './base.request';

class RegisterRequest extends BaseRequest {

  constructor() {
    super(RegisterRequest.rule);
  }

  public static rule() {
    return [
      body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Tên phải từ 2 đến 50 ký tự'),

      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Vui lòng cung cấp một email hợp lệ'),

      body('bio')
        .optional({ checkFalsy: true }) // Cho phép bỏ trống hoặc null
        .trim()
        .isLength({ min: 10, max: 200 })
        .withMessage('Tiểu sử phải từ 10 đến 200 ký tự (nếu có)'),

      body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),

      body('role')
        .optional()
        .isIn(['user', 'admin', 'artist'])
        .withMessage('Vai trò không hợp lệ'),
    ];
  }
}

const registerRequest = new RegisterRequest();

export default registerRequest;