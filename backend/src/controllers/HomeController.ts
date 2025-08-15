import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { appQueue } from '@/queues/queue';
import EmailJob from '@/queues/jobs/EmailJob';

class HomeController extends BaseController {
  public index = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    appQueue.addJob(EmailJob, {
      email: 'longdh2.dev@gmail.com',
      subject: 'Welcome to the API',
      body: 'Thank you for joining our API!'
    })
    return this.sendSuccess(res, { message: 'Welcome to the API Home' });
  });

  public queueWithCronJobVercel = async (req: Request, res: Response) => {
     await appQueue.processJobsOnce();
     return this.sendSuccess(res, { message: 'Jobs processed successfully' });
  }
}


const homeController = new HomeController();
export default homeController;
