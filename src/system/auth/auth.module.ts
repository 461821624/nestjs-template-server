import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [],
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: config.get('jwt.secret'),
        signOptions: {
          expiresIn: config.get('jwt.expiresIn'),
        },
      }),
    }),
    // 模块间循环依赖处理
    forwardRef(() => UserModule),
  ],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
