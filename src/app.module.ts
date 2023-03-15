import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './system/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './system/auth/auth.module';
import { RolesModule } from './system/roles/roles.module';
import { APP_PIPE } from '@nestjs/core';
import { TenantModule } from './system/tenant/tenant.module';
import * as config from 'config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MenuModule } from './system/menu/menu.module';
import { Oauth2Module } from './system/oauth2/oauth2.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(config.get('db')),
    AuthModule,
    RolesModule,
    TenantModule,
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: config.get('redis.host'),
        port: config.get('redis.port'),
        password: config.get('redis.password'),
      },
    }),
    MenuModule,
    Oauth2Module,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
