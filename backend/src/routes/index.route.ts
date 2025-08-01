import { Router, Response, Request } from 'express';
import { appService } from '../services';
import routerApi from './api.route';
import logger from '@utils/logger';

class RoutesSetup {
  public static init(router: Router): void {
    // API routes
    router.use('/api', routerApi);

    // Health check route
    router.get('/health', (req: Request, res: Response) => {
      return appService.healthCheck(req, res);
    });

    router.use('*', (req: Request, res: Response) => {
      logger.warn(`404 Not Found: ${req.method} ${req.path} - ${req.ip}`);
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });
  }
}

export default RoutesSetup;