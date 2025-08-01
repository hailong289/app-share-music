
import express, { Request, Response, NextFunction } from 'express';
export class BodyParsingMiddleware {
  public static handleBodyParsing(req: Request, res: Response, next: NextFunction): void {
    express.json({ limit: '10mb' })(req, res, next);
    express.urlencoded({ extended: true })(req, res, next);
  }
}