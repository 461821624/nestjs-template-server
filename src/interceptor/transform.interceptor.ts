import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Logger } from '../common/utils/log4j.util';
import * as dayjs from 'dayjs';
import { Request } from 'express';
import { CreateLoggerDto } from '../infra/logger/dto/create-logger.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { LoggerService } from '../infra/logger/logger.service';
import Redis from 'ioredis';
import * as config from 'config';
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(
    @InjectRedis() private readonly client: Redis,
    private readonly loggerService: LoggerService,
  ) {}
  private readonly whitelist = ['/api/user/login', '/status'];
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const req = context.getArgByIndex(1).req;
    return next.handle().pipe(
      map(async (data) => {
        if (data) {
          this.format_date(data.data);
          const logFormat = `-----------------------------------------------------------------------
          Request original url: ${req.originalUrl}
          Method: ${req.method}
          IP: ${req.ip}
          User: ${JSON.stringify(req.user)}
          Params: ${JSON.stringify(req.params)}
          Query: ${JSON.stringify(req.query)}
          Body: ${JSON.stringify(req.body)}
          Response data: ${JSON.stringify(data.data)}
          StatusCode: ${JSON.stringify(data.code)}
          resultMsg: ${JSON.stringify(data.msg)};
        -----------------------------------------------------------------------`;
          Logger.info(logFormat);
          Logger.access(logFormat);
          const result = await JSON.parse(
            await this.client.get(
              `${config.get('server.name')}:user_id_${req.user.userId}`,
            ),
          );
          if (this.shouldLog(req)) {
            const loggerDto = new CreateLoggerDto();

            loggerDto.user_id = req.user ? req.user.userId : '';
            loggerDto.user_type = 1;
            loggerDto.application_name = config.get('server.name');
            loggerDto.request_method = req.method;
            loggerDto.request_url = req.originalUrl;
            loggerDto.request_params = `{Params:${JSON.stringify(
              req.params,
            )},Query:${JSON.stringify(req.query)},Body:${JSON.stringify(
              req.body,
            )}}`;
            loggerDto.user_ip = req.ip;
            loggerDto.user_agent = req.headers['user-agent'];
            loggerDto.begin_time = dayjs(startTime).format(
              'YYYY-MM-DD HH:mm:ss',
            );
            loggerDto.end_time = dayjs(Date.now()).format(
              'YYYY-MM-DD HH:mm:ss',
            );
            // 获取这个请求的持续时间
            loggerDto.duration = Date.now() - startTime;
            loggerDto.result_code = data.code;
            loggerDto.result_msg = data.msg;
            loggerDto.tenant_id = result.tenant_id;

            loggerDto.creator = result.username;
            loggerDto.create_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
            loggerDto.updater = result.username;
            loggerDto.update_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
            console.log(loggerDto);
            await this.loggerService.create(loggerDto);
          }
          return data;
        } else {
          return null;
        }
      }),
    );
  }
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
  private shouldLog(req: Request): boolean {
    const url = req.originalUrl;
    return !this.whitelist.some((path) => url.startsWith(path));
  }
}
