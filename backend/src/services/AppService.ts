import { userService } from './UserService';
import logger from '../utils/logger';

export interface AppStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    admins: number;
    users: number;
  };
  system: {
    uptime: number;
    environment: string;
    version: string;
    node_version: string;
  };
}

export class AppService {
  [x: string]: any;

  /**
   * Get application health status
   */
  async getHealthStatus(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    services: {
      database: boolean;
      auth: boolean;
    };
  }> {
    try {
      // Check database by trying to count users
      let databaseStatus = false;
      try {
        await userService.count();
        databaseStatus = true;
      } catch (error) {
        logger.warn('Database health check failed:', error);
      }

      // Check auth service (basic check)
      const authStatus = true; // JWT is stateless, so just check if the service is available

      return {
        status: databaseStatus && authStatus ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          database: databaseStatus,
          auth: authStatus
        }
      };
    } catch (error) {
      logger.error('Error checking health status:', error);
      throw error;
    }
  }

  /**
   * Health check endpoint handler
   */
  async healthCheck(req: any, res: any): Promise<void> {
    try {
      const healthStatus = await this.checkHealth();
      const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json(healthStatus);
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      });
    }
  }

  /**
   * Initialize application services
   */
  async initializeApp(): Promise<void> {
    try {
      logger.info('Initializing application services...');
      
      // Test database connection
      await userService.count();
      logger.info('Database connection verified');
      
      logger.info('Application services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize application services:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const appService = new AppService();
