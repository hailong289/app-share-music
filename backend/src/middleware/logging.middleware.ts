import logger from "../utils/logger";


export class LoggingMiddleware {
  public static logRequest(req: any, res: any, next: any): void {
    const { method, url, headers } = req;
    const timestamp = new Date().toISOString();
    logger.info(`[${timestamp}] ${method} request to ${url}`);
    next();
  }
}