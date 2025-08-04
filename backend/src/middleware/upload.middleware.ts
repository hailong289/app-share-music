import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

const multer = require('multer');

export class UploadMiddleware {
  public static createUploadMiddleware() {
    // Ensure uploads directory exists
    const uploadsDir = 'uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (req: any, file: any, cb: any) => {
        cb(null, 'uploads/'); 
      },
      filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
      }
    });

    const fileFilter = (req: any, file: any, cb: any) => {
      if (file.mimetype.startsWith('audio/')) {
        cb(null, true);
      } else {
        cb(new Error('Chỉ cho phép tải lên tệp âm thanh'), false);
      }
    };

    const upload = multer({ 
      storage: storage,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
      fileFilter: fileFilter
    });

    return upload.single('file');
  }

  public static handleUploadError(err: any, req: Request, res: Response, next: NextFunction) {
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Tệp quá lớn. Kích thước tối đa là 10MB'
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Tải lên tệp thất bại'
      });
    }

    next();
  }
}
export default UploadMiddleware;