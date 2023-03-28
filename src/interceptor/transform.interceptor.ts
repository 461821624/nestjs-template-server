import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Logger } from '../common/utils/log4j.util';
import * as dayjs from 'dayjs';
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const request = context.switchToHttp().getRequest();
    // request.header('Content-Type', 'application/json; charset=utf-8');

    const req = context.getArgByIndex(1).req;
    return next.handle().pipe(
      map((data) => {
        if (data) {
          this.format_date(data.data);
          const logFormat = `-----------------------------------------------------------------------
          Request original url: ${req.originalUrl}
          Method: ${req.method}
          IP: ${req.ip}
          User: ${JSON.stringify(req.user)}
          Response data: ${JSON.stringify(data.data)}
        -----------------------------------------------------------------------`;
          Logger.info(logFormat);
          Logger.access(logFormat);
          return data;
        } else {
          return null;
        }
      }),
    );
  }
  // q: 解释下面代码

  format_date(data) {
    for (const key in data) {
      if (
        key === 'create_time' ||
        key === 'update_time' ||
        key === 'login_date'
      ) {
        data[key] = dayjs(data[key]).format('YYYY-MM-DD HH:mm:ss');
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        this.format_date(data[key]);
      }
      if (key === 'password') {
        delete data[key];
      }
    }
  }
}
