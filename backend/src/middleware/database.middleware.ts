import { Request, Response, NextFunction } from 'express';
import { Database } from '../config/database';
import logger from '../utils/logger';

export class DatabaseMiddleware {
  /**
   * Middleware to check if database is connected before processing routes
   */
  public static checkDatabaseConnection = (req: Request, res: Response, next: NextFunction): void => {
    const database = Database.getInstance();

    if (!database.isConnectedToDatabase()) {
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
    const database = Database.getInstance();

    if (!database.isConnectedToDatabase()) {
      logger.warn(`Warning: Database not connected for ${req.method} ${req.path}`);
    }

    next();
  };
}
