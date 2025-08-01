import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { Database } from '@config/database';
import logger from './utils/logger';
import MiddlewareSetup from '@middleware/index.middleware';
import RoutesSetup from '@routes/index.route';

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
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
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
        const database = Database.getInstance();
        await database.connect();
        logger.info('Database connected successfully');
      } catch (dbError) {
        logger.error('Failed to connect to database:', dbError);
      }
      
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
