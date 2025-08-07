import express, { Request, Response, NextFunction } from 'express';

export class BodyParsingMiddleware {
  public static handleBodyParsing(req: Request, res: Response, next: NextFunction): void {
    const contentType = req.headers['content-type'] || '';
    
    // console.log('Content-Type:', contentType);
    // console.log('Method:', req.method);
    // console.log('URL:', req.url);

    // Check và parse JSON
    if (contentType.includes('application/json')) {
      express.json({ limit: '10mb' })(req, res, (err) => {
        // console.log('JSON Body:', req.body);
        next();
      });
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      express.urlencoded({ extended: true, limit: '10mb' })(req, res, (err) => {
        // console.log('URL-encoded Body:', req.body);
        next();
      });
    } else if (contentType.includes('multipart/form-data')) {
      next();
    } else if (req.method === 'GET' || req.method === 'DELETE') {
      next();
    } else {
      next(); // Vẫn cho qua, có thể API không cần body
    }
  }
}