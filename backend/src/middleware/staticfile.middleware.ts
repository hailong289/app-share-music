import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

export class StaticFileMiddleware {
  public static serveUploads() {
    return express.static(path.join(__dirname, '../../uploads'), {
      maxAge: '1d',
      setHeaders: (res: Response, filePath: string) => {
        const ext = path.extname(filePath).toLowerCase();

        // Set proper content type
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(ext)) {
          res.setHeader('Content-Type', `image/${ext === '.jpg' ? 'jpeg' : ext.slice(1)}`);
        } else if (['.mp3', '.wav', '.m4a', '.flac'].includes(ext)) {
          res.setHeader('Content-Type', `audio/${ext.slice(1) === 'm4a' ? 'mp4' : ext.slice(1)}`);
        }

        // Add security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
      }
    });
  }

  public static handleFileNotFound() {
    return (req: Request, res: Response, next: NextFunction) => {
      const filePath = path.join(__dirname, '../../uploads', req.path);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          error: 'File not found',
          message: `The requested file '${req.path}' does not exist`,
          path: req.originalUrl
        });
      }

      next();
    };
  }
}
