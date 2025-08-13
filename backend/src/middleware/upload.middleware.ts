import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

const multer = require('multer');

export class UploadMiddleware {
  // Utility function to create slug from title
  private static createSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  public static createUploadMiddleware() {
    // Ensure uploads directory exists
    const uploadsDir = 'uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (req: any, file: any, cb: any) => {
        cb(null, 'uploads'); 
      },
      filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = req.body.title ? UploadMiddleware.createSlug(req.body.title) : Date.now() + '-' + Math.round(Math.random() * 1E9);
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

  public static async uploadMp3(req: Request, res: Response, next: NextFunction) {
    const upload = UploadMiddleware.createUploadMiddleware();
    
    upload(req, res, (err: any) => {
      if (err) {
        return UploadMiddleware.handleUploadError(err, req, res, next);
      }
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Không có tệp nào được tải lên'
        });
      }
      req.body.audio_url = req.file.path;
      next();
    });
  }
}
export default UploadMiddleware;