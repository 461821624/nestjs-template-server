import { Module } from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { Oauth2Controller } from './oauth2.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth2Client } from './entities/oauth2-client.entity';

@Module({
  controllers: [Oauth2Controller],
  providers: [Oauth2Service],
  imports: [TypeOrmModule.forFeature([Oauth2Client])],
})
export class Oauth2Module {}
