import { Router } from 'express';
import UploadController from '@/controllers/UploadController';
import UploadMiddleware from '@/middleware/upload.middleware';

const routerUpload = Router();

routerUpload.get('/', UploadController.getFiles); // GET /api/upload - Lấy danh sách file

// POST /api/upload - Upload file với middleware
routerUpload.post('/', 
  UploadMiddleware.createUploadMiddleware(), 
  UploadMiddleware.handleUploadError,
  UploadController.uploadFile
);

// DELETE /api/upload/:id - Delete file
routerUpload.delete('/:id', UploadController.deleteFile);

export default routerUpload;