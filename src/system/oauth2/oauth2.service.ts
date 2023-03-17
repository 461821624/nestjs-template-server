import { Injectable } from '@nestjs/common';
import { CreateOauth2ClientDto } from './dto/create-oauth2-client.dto';

import { PageQueryDto } from '../../common/dto/page-query.dto';
import { ResultData } from '../../common/dto/result-data.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Oauth2Client } from './entities/oauth2-client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import * as oauth2orize from 'oauth2orize';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { AuthorizeOAuth2 } from './dto/authorize-oauth.dto';
@Injectable()
export class Oauth2Service {
  authorize(authorizeOAuth2: AuthorizeOAuth2, req: any, res: Response) {
    console.log(req.user);
    return res.render('index');
  }
  constructor(
    @InjectRepository(Oauth2Client)
    private oauth2ClientRepository: Repository<Oauth2Client>,
  ) {}
  create(createOauth2Dto: CreateOauth2ClientDto) {
    return 'This action adds a new oauth2';
  }

  async findAll(params: any, option: IPaginationOptions) {
    const { keyword, sortBy, descending } = params;
    const search = keyword || '';
    const sort = sortBy || 'create_time';
    const des = descending || 'ASC';
    const queryBuilder =
      this.oauth2ClientRepository.createQueryBuilder('oauth2Client');
    if (search) {
      queryBuilder
        .where('oauth2Client.name LIKE :name', { name: '%' + search + '%' })
        .andWhere('oauth2Client.deleted = :deleted', { deleted: 0 })
        .orderBy(`oauth2Client.${sort}`, des); // Or whatever you need to do
    } else {
      queryBuilder
        .orderBy(`oauth2Client.${sort}`, des)
        .where('oauth2Client.deleted = :deleted', { deleted: 0 }); // Or whatever you need to do
    }
    const promise = await paginate<Oauth2Client>(queryBuilder, option);
    return ResultData.ok({ list: promise.items, ...promise.meta });
    // return ResultData.ok(0);
  }

  findOne(id: number) {
    // const server = oauth2orize.createServer();
    // server.grant(
    //   oauth2orize.grant.code(function (
    //     client: any,
    //     redirectUri: string,
    //     user: any,
    //     res: any,
    //     callback: any,
    //   ) {
    //     // new AuthorizationCode()
    //     return callback(null, 111);
    //   }),
    // );
    // server.grant(
    //   oauth2orize.grant.code(function (client, redirectURI, user, ares, done) {
    //     const code = randomUUID();
    //     const ac = new AuthorizationCode(
    //       code,
    //       client.id,
    //       redirectURI,
    //       user.id,
    //       ares.scope,
    //     );
    //     ac.save(function (err) {
    //       if (err) {
    //         return done(err);
    //       }
    //       return done(null, code);
    //     });
    //   }),
    return `This action returns a #${id} oauth2`;
  }

  remove(id: number) {
    return `This action removes a #${id} oauth2`;
  }
}
