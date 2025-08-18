import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export class BodyParsingMiddleware {
  /**
   * Middleware to handle body parsing for different content types
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Next middleware function
   */
  public static handleBodyParsing(req: Request, res: Response, next: NextFunction): void {
    const contentType = req.headers['content-type'] || '';
    const upload = multer({ storage: multer.memoryStorage() });
    const parsers: Record<string, any> = {
      'application/json': express.json({ limit: '10mb' }),
      'application/x-www-form-urlencoded': express.urlencoded({ extended: true, limit: '10mb' }),
      'multipart/form-data': upload.any(),
    };

    for (const type in parsers) {
      if (contentType.includes(type)) {
        return parsers[type](req, res, (err: any) => BodyParsingMiddleware.handleParse(req, res, err, next, type));
      }
    }

    next();
  }

  protected static handleParse(req: Request, res: Response, error: Error, next: NextFunction, type: string) {
    if (type === 'multipart/form-data') {
      // Giữ nguyên dữ liệu gốc từ multer
      if (!req.files || !Array.isArray(req.files)) {
        req.files = [];
      }

      // Gom tất cả file vào 1 field cố định
      req.body.files = [];

      for (const file of req.files as Express.Multer.File[]) {
        req.body.files.push(file);
      }
    }
    if (error) {
      console.error(`Error parsing request body (${type}):`, error);
    }
    next();
  }
}
