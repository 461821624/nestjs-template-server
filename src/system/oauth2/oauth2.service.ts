import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
@Injectable()
export class Oauth2Service {
  constructor(
    @InjectRepository(Oauth2Client)
    private oauth2ClientRepository: Repository<Oauth2Client>,
    private readonly jwtService: JwtService, // private readonly usersService: UserService,
  ) {}
  /**
   * 验证客户端参数
   * @param req 参数
   * @param res 响应
   */
  async verifyClent(req: AuthorizeOAuth2, res: any) {
    const { state, client_id, secret, redirect_uri, response_type } = req;
    const client = await this.oauth2ClientRepository.findOne({
      where: {
        client_id,
        secret,
      },
    });
    if (!client) {
      throw new Error('无此应用');
    }
    console.log(redirect_uri);
    if (!client.redirect_uris.includes(redirect_uri))
      throw new Error('参数错误');
    res.render('index', {
      logo: client.logo,
    });
  }
  generateToken(code: any, redirect_uri: any, user: any) {
    throw new Error('Method not implemented.');
  }
  validateRedirectUri(user: any, redirect_uri: any) {
    throw new Error('Method not implemented.');
  }
  generateAuthorizationCode(user: any) {
    throw new Error('Method not implemented.');
  }
  create(createOauth2Dto: CreateOauth2ClientDto) {
    return 'This action adds a new oauth2';
  }
  validateOAuthUser(profile: any) {
    return null;
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
  async generateTokenFromRefreshToken(refreshToken: string): Promise<any> {
    try {
      // Verify and decode the refresh token
      const decodedToken = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      // Check if the refresh token is expired
      if (decodedToken.exp <= Math.floor(Date.now() / 1000)) {
        throw new Error('Refresh token is expired');
      }

      // Find the user associated with the refresh token
      // const user = await this.usersService.findById(decodedToken.sub);
      const user: any = {};
      // Generate a new access token and refresh token
      const accessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        refresh_token: newRefreshToken,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  private generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
      name: user.username,
    };

    const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME;
    const secret = process.env.JWT_REFRESH_TOKEN_SECRET;

    return this.jwtService.sign(payload, { expiresIn, secret });
  }

  private generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      name: user.username,
    };

    const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME;
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET;

    return this.jwtService.sign(payload, { expiresIn, secret });
  }
}
