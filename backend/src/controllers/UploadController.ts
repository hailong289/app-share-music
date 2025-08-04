import { Request, Response } from 'express';
import { BaseController } from './BaseController';

class UploadController extends BaseController{
    public uploadFile = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.body.file) {
                return this.sendValidationError(res, [{ field: 'file', message: 'File is required' }]);
            }
            const file = req.body.file;
            return this.sendSuccess(res, { fileName: file.filename }, 'File uploaded successfully');
        } catch (error) {
            return this.sendInternalError(res, error, 'Failed to upload file');
        }
    });

    public deleteFile = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
        try {
            const fileId = req.params.id;
            this.sendSuccess(res, null, 'File deleted successfully');
        } catch (error) {
            this.sendInternalError(res, error, 'Failed to delete file');
        }
    });
}


export default new UploadController();