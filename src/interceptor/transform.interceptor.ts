import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Logger } from '../common/utils/log4j.util';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const request = context.switchToHttp().getRequest();
    // request.header('Content-Type', 'application/json; charset=utf-8');

    const req = context.getArgByIndex(1).req;
    return next.handle().pipe(
      map((data) => {
        if (data) {
          console.log(data);
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
}
