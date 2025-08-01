import { Request, Response, NextFunction } from 'express';
import { Connection } from '@/database/connection';
import logger from '../utils/logger';

export class DatabaseMiddleware {
  /**
   * Middleware to check if database is connected before processing routes
   */
  public static checkDatabaseConnection = (req: Request, res: Response, next: NextFunction): void => {
    const conn = Connection.getInstance();

    if (!conn.isConnectedToDatabase()) {
      logger.warn(`Database not connected for ${req.method} ${req.path}`);

      res.status(503).json({
        success: false,
        message: 'Database service is currently unavailable. Please try again later.',
        error: 'DATABASE_UNAVAILABLE'
      });
      return;
    }

    next();
  };

  /**
   * Middleware that allows routes to continue even without database connection
   * but logs a warning
   */
  public static warnDatabaseConnection = (req: Request, res: Response, next: NextFunction): void => {
    const conn = Connection.getInstance();

    if (!conn.isConnectedToDatabase()) {
      logger.warn(`Warning: Database not connected for ${req.method} ${req.path}`);
    }

    next();
  };
}
