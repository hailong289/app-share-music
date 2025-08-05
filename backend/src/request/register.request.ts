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

  body('bio')
    .optional({ checkFalsy: true }) // Cho phép bỏ trống hoặc null
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Tiểu sử phải từ 10 đến 200 ký tự (nếu có)'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
   // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    // .withMessage('Mật khẩu phải chứa ít nhất một chữ cái viết thường, một chữ cái viết hoa và một số')
  body('role')
    .optional()
    .isIn(['user', 'admin', 'artist'])
    .withMessage('Vai trò không hợp lệ'),
   
];