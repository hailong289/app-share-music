import { Request, Response } from "express";


export class RateLimitMiddleware {
  public static applyRateLimit() {
    const rateLimit = require('express-rate-limit');

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      standardHeaders: 'draft-7', // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      keyGenerator: (req: Request, res: Response) => req.ip + "-" + req.headers["user-agent"],
      skip: (req: Request, res: Response) => req.ip === "127.0.0.1", // Bỏ qua localhost
      message: {
        status: 429,
        error: 'Too many requests, please try again later.'
      }
    });

    return limiter;
  }
}
