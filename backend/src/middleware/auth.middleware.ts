import { Request, Response, NextFunction } from 'express';
import { JWTUtil, JWTPayload } from '../utils/jwt';
import { User } from '../models/User';
import logger from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export class AuthMiddleware {
  public static async authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'Access token is required'
        });
        return;
      }
      
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      const decoded = JWTUtil.verifyToken(token);
      
      // Verify user still exists and is active
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'User no longer exists or is inactive'
        });
        return;
      }
      
      req.user = decoded;
      next();
    } catch (error) {
      logger.error('Authentication error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  }
  
  public static authorize(...roles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }
      
      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
        return;
      }
      
      next();
    };
  }
}
