import { body } from 'express-validator';

export const registerRequest = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên phải từ 2 đến 50 ký tự'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Vui lòng cung cấp một email hợp lệ'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    // .withMessage('Mật khẩu phải chứa ít nhất một chữ cái viết thường, một chữ cái viết hoa và một số')
];