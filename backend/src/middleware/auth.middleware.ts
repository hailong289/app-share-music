import { Request, Response, NextFunction } from 'express';
import { JWTUtil, JWTPayload } from '../utils/jwt';
import logger from '../utils/logger';
import { User } from '@/models';

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
          message: 'Xác thực không thành công!'
        });
        return;
      }
      
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      const decoded = await JWTUtil.verifyTokenJwt(token);
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Tài khoản không còn tồn tại hoặc đã bị vô hiệu hóa'
        });
        return;
      }
      
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }
  }
  
  public static authorize(...roles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Xác thực không thành công!'
        });
        return;
      }
      
      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: 'Bạn không có quyền truy cập vào tài nguyên này'
        });
        return;
      }
      
      next();
    };
  }
}
