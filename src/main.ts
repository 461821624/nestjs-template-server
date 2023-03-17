import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import Chalk from 'chalk';
import { mw as requestIpMw } from 'request-ip';
import { logger } from './common/utils/logger.middleware';
import { Logger } from './common/utils/log4j.util';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import * as config from 'config';
import { HttpExceptionsFilter } from './common/filters/http-exceptions-filter';
import { ExceptionsFilter } from './common/filters/exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as session from 'express-session';
console.log(config.get('db'));
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),
  );
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  /**
   * AuthorizationServer
   */
  // web 安全，防常见漏洞
  app.use(helmet());
  app.setGlobalPrefix(config.get('server.api-prefix'));
  app.use(requestIpMw({ attributeName: 'ip' }));
  app.use(logger);
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('nest-api')
    .setDescription('The cats API description')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.get('swagger.doc-prefix'), app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // skipMissingProperties: true,
      // skipNullProperties: true,
    }),
  );
  // 模板引擎
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  console.log(join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');
  app.useGlobalInterceptors(new TransformInterceptor());
  // 所有异常
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionsFilter());
  await app.listen(config.get('server.port'));
  Logger.log(
    Chalk.green(`Nest-Admin 服务启动成功 `),
    `http://localhost:${config.get('server.port')}/`,
    '\n',
    Chalk.green('swagger 文档地址        '),
    `http://localhost:${config.get('server.port')}${config.get(
      'swagger.doc-prefix',
    )}`,
  );
}

bootstrap();
