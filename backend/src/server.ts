import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { Connection } from '@database/connection';
import logger from './utils/logger';
import MiddlewareSetup from '@middleware/index.middleware';
import RoutesSetup from '@routes/index.route';
import { BaseController } from './controllers/BaseController';

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
  }

  private initializeErrorHandling(): void {
    // Lỗi toàn bộ ứng dụng
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error('Global error handler:', error);
      return (new BaseController()).sendInternalError(res, error);
    });
  }

  public async start(): Promise<void> {
    try {
      // Bắt đầu tạo thư mục logs
      const fs = await import('fs');
      const logsDir = path.join(__dirname, '../logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      // Bắt đầu server
      this.app.listen(this.port, () => {
        logger.info(`Server is running on: ${process.env.APP_URL || `http://localhost:${this.port}`}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
      
      // Kết nối đến cơ sở dữ liệu
      try {
        const conn = Connection.getInstance();
        await conn.connectDB();
      } catch (dbError) {}
      
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Bắt đầu ứng dụng
const app = new App();
app.start();

export default App;
