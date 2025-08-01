import { Request, Response } from 'express';
import { BaseController } from './BaseController';

class HomeController extends BaseController {
  public index = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
     return this.sendSuccess(res, { message: 'Welcome to the API' });
  });
}


const homeController = new HomeController();
export default homeController;