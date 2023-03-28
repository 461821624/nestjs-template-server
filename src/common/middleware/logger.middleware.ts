import { NextFunction, Request, Response } from 'express';
import { Logger } from '../utils/log4j.util';
import { Injectable, NestMiddleware } from '@nestjs/common';
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {
    const statusCode = res.statusCode;
    const logFormat = `   -----------------------------------------------------------------------
    RequestOriginal: ${req.originalUrl}
    Method: ${req.method}
    IP: ${req.ip}
    StatusCode: ${statusCode}
    Params: ${JSON.stringify(req.params)}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
    -----------------------------------------------------------------------`;
    console.log('111111111', req.clientIp);
    next();

    if (statusCode >= 500) {
      Logger.error(logFormat);
    } else if (statusCode >= 400) {
      Logger.warn(logFormat);
    } else {
      Logger.access(logFormat);
      Logger.log(logFormat);
    }
  }
  // logger(req: Request, res: Response, next: NextFunction) {

  // }
}
