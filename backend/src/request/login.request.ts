import { body } from 'express-validator';

export const loginRequest = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Vui lòng cung cấp một email hợp lệ'),

  body('password')
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc')
];