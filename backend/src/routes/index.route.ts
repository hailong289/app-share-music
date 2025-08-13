import { Router, Response, Request, NextFunction } from 'express';
import { appService } from '../services';
import routerApi from './api.route';
import logger from '@utils/logger';
import routerUpload from './upload.route';

class RoutesSetup {
  public static init(router: Router): void {
    // API routes
    router.use('/api', routerApi);

    // Health check route
    router.get('/health', async (req: Request, res: Response, next: NextFunction) => {
      try {
        await appService.healthCheck(req, res);
      } catch (error) {
        next(error);
      }
    });
  }
}

export default RoutesSetup;
