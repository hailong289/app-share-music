import { Response, Request, NextFunction } from 'express';
import logger from '../utils/logger';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field?: string;
    message: string;
  }> | {
    message: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class BaseController {
  /**
   * Send success response
   */
  protected sendSuccess<T>(
    res: Response,
    data?: T,
    message: string = 'Success',
    statusCode: number = 200
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data
    };

    res.status(statusCode).json(response);
    return;
  }

  /**
   * Send success response with pagination
   */
  protected sendSuccessWithPagination<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    },
    statusCode: number = 200
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta
    };

    res.status(statusCode).json(response);
    return;
  }

  /**
   * Send error response
   */
  protected sendError(
    res: Response,
    message: string = 'Error',
    statusCode: number = 500,
    errors?: Array<{ field?: string; message: string }> | {
      message: string
    }
  ): void {
    const response: ApiResponse = {
      success: false,
      message,
      errors
    };

    res.status(statusCode).json(response);
    return;
  }

  /**
   * Send validation error response
   */
  protected sendValidationError(
    res: Response,
    errors?: Array<{ field?: string; message: string }> | {
      message: string
    },
    message: string = 'Validation failed'
  ): void {
    return this.sendError(res, message, 400, errors);
  }

  /**
   * Send not found error
   */
  protected sendNotFound(
    res: Response,
    message: string = 'Resource not found'
  ): void {
    return this.sendError(res, message, 404);
  }

  /**
   * Send unauthorized error
   */
  protected sendUnauthorized(
    res: Response,
    message: string = 'Unauthorized'
  ): void {
    return this.sendError(res, message, 401);
  }

  /**
   * Send forbidden error
   */
  protected sendForbidden(
    res: Response,
    message: string = 'Forbidden'
  ): void {
    return this.sendError(res, message, 403);
  }

  /**
   * Send conflict error
   */
  protected sendConflict(
    res: Response,
    message: string = 'Conflict'
  ): void {
    return this.sendError(res, message, 409);;
  }

  /**
   * Send internal server error
   */
  public sendInternalError(
    res: Response,
    error: Error | unknown,
    message: string = 'Internal server error'
  ): void {
    logger.error('Internal server error:', error);
    const response: ApiResponse = {
      success: false,
      message,
      ...(process.env.APP_ENV === 'development' && {
        errors: [{ message: (error as Error).message || 'Unknown error' }]
      })
    };

    res.status(500).json(response);
    return;
  }

  /**
   * Send created response
   */
  protected sendCreated<T>(
    res: Response,
    data?: T,
    message: string = 'Created successfully'
  ): void {
    return this.sendSuccess(res, data, message, 201);
  }

  /**
   * Send no content response
   */
  protected sendNoContent(res: Response): void {
    res.status(204).send();
    return;
  }

  /**
   * Handle async controller methods and catch errors
   */
  protected asyncHandler = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      return Promise.resolve(fn(req, res, next)).catch((error) => {
        return this.sendInternalError(res, error); // các lỗi nghiêm trọng sẽ được gửi về đây
      });
    };
  };
}
