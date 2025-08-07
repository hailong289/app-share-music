import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { appQueue } from '@/queues/queue';
import EmailJob from '@/queues/jobs/EmailJob';
import Mailer from '@/mails/mailer';

class HomeController extends BaseController {
  public index = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    return this.sendSuccess(res, { message: 'Welcome to the API Home' });
  });
}


const homeController = new HomeController();
export default homeController;
