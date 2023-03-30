import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { UserModule } from './system/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './system/auth/auth.module';
import { RolesModule } from './system/roles/roles.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TenantModule } from './system/tenant/tenant.module';
import * as config from 'config';
import { InjectRedis, RedisModule } from '@liaoliaots/nestjs-redis';
import { MenuModule } from './system/menu/menu.module';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { DeptModule } from './system/dept/dept.module';
import { PostModule } from './system/post/post.module';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { MenuService } from './system/menu/menu.service';
import Redis from 'ioredis';
import Chalk from 'chalk';
import { Logger } from './common/utils/log4j.util';
import { DeptService } from './system/dept/dept.service';
import { RolesService } from './system/roles/roles.service';
import { LoggingMiddleware } from './common/middleware/logger.middleware';
import { LoggerModule } from './infra/logger/logger.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';

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
    DeptModule,
    PostModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap, NestModule {
  // q: 为什么要实现OnApplicationBootstrap接口？
  // a: 因为我们需要在应用启动时，缓存一些数据，比如菜单、角色、用户等等
  //    这些数据在应用启动时就需要缓存，而不是在第一次请求时才缓存
  //    这样做的好处是，第一次请求时，数据已经缓存了，不需要再去数据库查询
  //    这样可以提高应用的响应速度
  //    这里我们使用了OnApplicationBootstrap接口，也可以使用其他方式
  //    比如使用定时任务，每隔一段时间就去缓存一次数据
  //    这里我们使用OnApplicationBootstrap接口，是因为这个接口是在应用启动时执行的
  //    而且这个接口只会执行一次
  //    如果使用定时任务，那么就需要考虑定时任务的执行频率，比如每隔多久执行一次
  //    如果频率太高，那么就会造成数据库压力过大，如果频率太低，那么就会造成数据不同步
  //    所以，这里我们使用OnApplicationBootstrap接口，是最合适的

  constructor(
    @InjectRedis() private readonly client: Redis,
    private readonly menuService: MenuService,
    private readonly deptService: DeptService,
    private readonly rolesService: RolesService,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    // consumer.apply(requestIp.mw()).forRoutes('*');
  }
  async onApplicationBootstrap() {
    // 缓存菜单
    const cacheMenu = await this.menuService.findAll();
    await this.client.set(
      `${config.get('server.name')}:system_menu`,
      JSON.stringify(cacheMenu),
    );
    // 缓存部门
    const cacheDept = await this.deptService.findDeptAll();
    await this.client.set(
      `${config.get('server.name')}:system_dept`,
      JSON.stringify(cacheDept),
    );
    // 缓存角色与菜单system_role_menu
    const cacheSystemRoleMenu = await this.rolesService.findAllRoleMenu();
    await this.client.set(
      `${config.get('server.name')}:system_role_menu`,
      JSON.stringify(cacheSystemRoleMenu),
    );
    // 缓存用户与角色;
    const cacheSystemUserRole = await this.rolesService.findAllUserRole();
    await this.client.set(
      `${config.get('server.name')}:system_user_role`,
      JSON.stringify(cacheSystemUserRole),
    );
    // 缓存角色
    const cacheRole = await this.rolesService.findAllRole();
    await this.client.set(
      `${config.get('server.name')}:system_role`,
      JSON.stringify(cacheRole),
    );

    Logger.log(
      Chalk.green(`缓存菜单，数量为:       `),
      `${cacheMenu.length}`,
      '\n',
      Chalk.green(`缓存部门，数量为:       `),
      `${cacheDept.length}`,
      '\n',
      Chalk.green(`缓存角色与菜单，数量为: `),
      `${cacheSystemRoleMenu.length}`,
      '\n',
      Chalk.green(`缓存用户与角色，数量为: `),
      `${cacheSystemUserRole.length}`,
      '\n',
      Chalk.green(`缓存角色，数量为:       `),
      `${cacheRole.length}`,
    );
  }
}
