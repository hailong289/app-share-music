import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { Connection } from '@database/connection';
import logger from './utils/logger';
import MiddlewareSetup from '@middleware/index.middleware';
import RoutesSetup from '@routes/index.route';
import { BaseController } from './controllers/BaseController';
import { appQueue } from './queues';

dotenv.config();

class App {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '5001');
    // Middleware setup
    MiddlewareSetup.init(this.app);
    // routes setup
    RoutesSetup.init(this.app);
    this.initializeErrorHandling();
    this.initializeDatabase();
  }

  private initializeErrorHandling(): void {
    // Lỗi toàn bộ ứng dụng
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error('Global error handler:', error);
      return (new BaseController()).sendInternalError(res, error);
    });
  }

  private async initializeDatabase(): Promise<void> {
    try {
      const conn = Connection.getInstance();
      await conn.connectDB();
    } catch (dbError) {
      logger.error('Database connection failed:', dbError);
    }
  }

  public async start(): Promise<void> {
    try {
      // Bắt đầu tạo thư mục logs
      const fs = await import('fs');
      const logsDir = path.join(__dirname, '../logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      // Chỉ start server khi không phải Vercel
      if (!process.env.VERCEL) {
        this.app.listen(this.port, () => {
          logger.info(`Server is running on: ${process.env.APP_URL || `http://localhost:${this.port}`}`);
          logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
      }

      setInterval(() => {
        console.log('Processing jobs...');
        appQueue.processJobsOnce();
      }, 5000);

    } catch (error) {
      logger.error('Failed to start server:', error);
      if (!process.env.VERCEL) {
        process.exit(1);
      }
    }
  }
}

// Tạo instance
const appInstance = new App();

// Chỉ start khi chạy trực tiếp (không phải import)
if (require.main === module) {
  appInstance.start();
}

// Export handler function cho Vercel (REQUIRED)
export default (req: Request, res: Response) => {
  return appInstance.app(req, res);
};

// Export app cho local development
export { appInstance };
