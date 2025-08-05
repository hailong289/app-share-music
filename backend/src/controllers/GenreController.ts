import { BaseController } from "./BaseController";
import { Response, Request, NextFunction } from 'express';


class GenreController extends BaseController {
    /**
     * name
     */
    public index(req: Request, res: Response) {
       return this.sendSuccess(res, [], 'Lấy danh sách thể loại thành công');
    }
    /**
     * getById
     */
    public async detail(req: Request, res: Response) {
        return this.sendSuccess(res, [], 'Lấy thể loại thành công');
    }
    /**
     * create
     */
    public create(req: Request, res: Response) {
        const { name } = req.body;
        if (!name) {
            return this.sendValidationError(res, [{ field: 'name', message: 'Name is required' }], 'Validation failed');
        }
        
    }
    /**
     * update
     */
    public update(req: Request, res: Response) {
        const { id, name } = req.body;
        if (!id) {
            return this.sendValidationError(res, [{ field: 'id', message: 'ID is required' }], 'Validation failed');
        }
        if (!name) {
            return this.sendValidationError(res, [{ field: 'name', message: 'Name is required' }], 'Validation failed');
        }

    }

    /**
     * delete
     */
    public delete(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            return this.sendValidationError(res, [{ field: 'id', message: 'ID is required' }], 'Validation failed');
        }
    }
    
}