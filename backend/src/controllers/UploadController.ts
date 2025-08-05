import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import express from 'express';
import path from 'path';
class UploadController extends BaseController {
    public uploadFile = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('UploadController:uploadFile called');
            
            // Kiểm tra xem có file được upload không
            if (!req.file) {
                return this.sendError(res, 'No file uploaded', 400);
            }

            const file = req.file;
            console.log('File received:', {
                originalname: file.originalname,
                filename: file.filename,
                size: file.size,
                mimetype: file.mimetype,
                path: file.path
            });

            const fileInfo = {
                originalName: file.originalname,
                fileName: file.filename,
                size: file.size,
                mimetype: file.mimetype,
                path: file.path,
                url: `/uploads/${file.filename}`
            };

            return this.sendSuccess(res, fileInfo, 'File uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            return this.sendInternalError(res, error, 'Failed to upload file');
        }
    });

    public getFiles = async (req: Request, res: Response): Promise<void> => {
        return this.sendSuccess(res, express.static(path.join(process.cwd(), 'uploads')), '');
    }

    public deleteFile = async (req: Request, res: Response): Promise<void> => {
        try {
            const fileId = req.params.id;
            // TODO: Implement file deletion logic
            return this.sendSuccess(res, null, 'File deleted successfully');
        } catch (error) {
            return this.sendInternalError(res, error, 'Failed to delete file');
        }
    };
}


export default new UploadController();