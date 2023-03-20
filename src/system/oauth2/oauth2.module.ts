import { Module } from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { Oauth2Controller } from './oauth2.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth2Client } from './entities/oauth2-client.entity';
import { PassportModule } from '@nestjs/passport';
import { OAuth2Strategy } from './oauth2.strategy';
import * as config from 'config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  controllers: [Oauth2Controller],
  providers: [Oauth2Service, OAuth2Strategy],
  imports: [
    TypeOrmModule.forFeature([Oauth2Client]),
    PassportModule.register({ defaultStrategy: 'oauth2' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: config.get('jwt.secret'),
        signOptions: {
          expiresIn: config.get('jwt.expiresIn'),
        },
      }),
    }),
  ],
})
export class Oauth2Module {}
