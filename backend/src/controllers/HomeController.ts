import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { appQueue } from '@/queues/queue';
import HomeService from '@/services/HomeService';

class HomeController extends BaseController {
  public index = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    return this.sendSuccess(res, { message: 'Welcome to the API Home' });
  });

  public queueWithCronJobVercel = async (req: Request, res: Response) => {
    await appQueue.processJobsOnce();
    return this.sendSuccess(res, { message: 'Jobs processed successfully' });
  }

  public home = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await HomeService.getList();
    return this.sendSuccess(res, result, 'Trang chủ');
  });

  public searchAll = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim() === '') {
      return this.sendError(res, 'Query parameter "q" is required', 400);
    }
    const result = await HomeService.searchAll(q);
    return this.sendSuccess(res, result, 'Kết quả tìm kiếm');
  });

}


const homeController = new HomeController();
export default homeController;
