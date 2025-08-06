import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { producerInstance } from '@/queues';

class HomeController extends BaseController {
  public index = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Send a welcome email job to the queue
    await producerInstance.sendEmailJob(
      'user@example.com',
      'Welcome to Music Share App!',
      'Hello, welcome to our music sharing platform!'
    );
    
    return this.sendSuccess(res, { message: 'Welcome to the API Home' });
  });
}


const homeController = new HomeController();
export default homeController;
