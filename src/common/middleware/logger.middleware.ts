import { NextFunction, Request, Response } from 'express';
import { Logger } from '../utils/log4j.util';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from '../../infra/logger/logger.service';
import { CreateLoggerDto } from '../../infra/logger/dto/create-logger.dto';
import * as config from 'config';
import * as dayjs from 'dayjs';
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(LoggerService) private readonly loggerService: LoggerService,
  ) {}
  // Q: 怎样获取响应结果？
  // A: 可以使用express的中间件，但是这样做的话，就需要在每个控制器中都引入中间件
  // private readonly whitelist = ['/api/user/login', '/status'];
  use(req: Request, res: Response<string>, next: () => void) {
    // if (!this.shouldLog(req)) {
    //   return next();
    // }
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
    // const start = process.hrtime();
    // const { ip, method, originalUrl } = req;
    // const userAgent = req.get('user-agent') || '';
    // res.on('finish', () => {
    //   const end = process.hrtime(start);
    //   const { statusCode } = res;
    //   const contentLength = res.get('content-length');

    //   // 存储日志到数据库

    //   const startTime = new Date();
    //   const createLoggerDto = new CreateLoggerDto();
    //   createLoggerDto.user_id = req.user['userId'];
    //   createLoggerDto.creator = req.user['username'];
    //   createLoggerDto.application_name = config.get('server.name');
    //   createLoggerDto.request_method = method;
    //   createLoggerDto.request_url = originalUrl;
    //   createLoggerDto.request_params = `{Params: ${JSON.stringify(
    //     req.params,
    //   )},Query: ${JSON.stringify(req.query)}, Body: ${JSON.stringify(
    //     req.body,
    //   )}}`;
    //   createLoggerDto.user_ip = ip;
    //   createLoggerDto.user_agent = userAgent;
    //   createLoggerDto.begin_time = dayjs(startTime).format(
    //     'YYYY-MM-DD HH:mm:ss',
    //   );
    //   createLoggerDto.end_time = dayjs(new Date()).format(
    //     'YYYY-MM-DD HH:mm:ss',
    //   );
    //   createLoggerDto.duration = end[1] / 1000000;
    //   createLoggerDto.result_code = statusCode;
    //   createLoggerDto.result_msg = res.statusMessage;
    //   createLoggerDto.deleted = 0;
    // });

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
  // private shouldLog(req: Request): boolean {
  //   const url = req.originalUrl;
  //   return !this.whitelist.some((path) => url.startsWith(path));
  // }
}
