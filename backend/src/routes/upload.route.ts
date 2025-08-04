import { Router } from 'express';
import UploadController from '@/controllers/UploadController';
import UploadMiddleware from '@/middleware/upload.middleware';

const routerUpload = Router();

routerUpload.post('/', UploadMiddleware.applyUpload(), UploadController.uploadFile);
routerUpload.delete('/:id', UploadMiddleware.applyUpload(), UploadController.deleteFile);

export default routerUpload;