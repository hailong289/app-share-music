import { Router, Response, Request, NextFunction } from 'express';
import { appService } from '../services';
import routerApi from './api.route';
import logger from '@utils/logger';

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

    router.use('*', (req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        return;
      }
      try {
        // Log 404 errors
        logger.warn(`404 Not Found: ${req.method} ${req.path} - ${req.ip}`);
        res.status(404).json({
          success: false,
          message: 'Route not found'
        });
      } catch (error) {
        next(error);
      }
    });
  }
}

export default RoutesSetup;