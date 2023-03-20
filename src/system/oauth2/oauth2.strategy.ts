import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { Oauth2Service } from './oauth2.service';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor(private oAuth2Service: Oauth2Service) {
    super({
      authorizationURL: '/api/oauth2/authorize',
      tokenURL: '/api/oauth2/token',
      clientID: 'EXAMPLE_CLIENT_ID',
      clientSecret: 'EXAMPLE_CLIENT_SECRET',
      callbackURL: 'http://localhost:3000/auth/example/callback',
    });
  }
  // async validate(accessToken: string, refreshToken: string, profile: any) {
  //   // Query the database or other authentication source to validate the user's identity
  //   const user = await this.oAuth2Service.validateOAuthUser(profile);
  //   return user;
  // }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // 根据 accessToken 和 refreshToken 获取用户信息，例如通过 API 请求
    // const user = await this.userService.getUserByToken(accessToken);

    if (!0) {
      return done(new Error('User not found'), false);
    }

    done(null, 0);
  }
}
