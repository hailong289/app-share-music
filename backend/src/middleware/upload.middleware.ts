import { Request } from 'express';

export class UploadMiddleware {
  public static applyUpload() {
    const multer = require('multer');
    const path = require('path');
    

    const storage = multer.diskStorage({
      destination: (req: Request, file: any, cb: any) => {
        cb(null, 'uploads/'); 
      },
      filename: (req: Request, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
      }
    });

    return multer({ storage }).single('file');
  }
}
export default UploadMiddleware;