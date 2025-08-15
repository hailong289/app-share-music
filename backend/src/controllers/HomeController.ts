import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { appQueue } from '@/queues/queue';
import EmailJob from '@/queues/jobs/EmailJob';

class HomeController extends BaseController {
  public index = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    return this.sendSuccess(res, { message: 'Welcome to the API Home' });
  });

  public queueWithCronJobVercel = async (req: Request, res: Response) => {
     await appQueue.processJobsOnce();
     return this.sendSuccess(res, { message: 'Jobs processed successfully' });
  }
}


const homeController = new HomeController();
export default homeController;
