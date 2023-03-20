import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { CreateOauth2ClientDto } from './dto/create-oauth2-client.dto';
import { Response } from 'express';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ResultData } from '../../common/dto/result-data.dto';
import { ApiResult } from '../../common/decorator/api-result.decorator';
import { FindOauth2ClientDto } from './dto/find-oauth2-client.dto';
import { PageQueryDto } from '../../common/dto/page-query.dto';
import { AuthorizeOAuth2 } from './dto/authorize-oauth.dto';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('OAuth 2.0')
@Controller('oauth2')
@ApiExtraModels(CreateOauth2ClientDto, ResultData, FindOauth2ClientDto)
export class Oauth2Controller {
  constructor(private readonly oauth2Service: Oauth2Service) {}

  @Post('create')
  create(@Body() createOauth2Dto: CreateOauth2ClientDto) {
    return this.oauth2Service.create(createOauth2Dto);
  }

  @Get()
  @ApiResult(FindOauth2ClientDto, true, true)
  async findAll(@Query() pageQueryDto: PageQueryDto): Promise<ResultData> {
    const { pageNo: page, pageSize: limit, ...params } = pageQueryDto;
    return await this.oauth2Service.findAll(params, { page, limit });
  }

  @Get('authorize')
  // @UseGuards(AuthGuard('oauth2'))
  async authorize(@Query() req: AuthorizeOAuth2, @Res() res) {
    //response_type=code&scope=openid+profile&state=142b15bf58f82ed87e2b308220bceaff65f97e2533c2255b
    // authorizationURL: '/api/oauth2/authorize',
    // tokenURL: '/api/oauth2/token',
    // clientID: 'EXAMPLE_CLIENT_ID',
    // clientSecret: 'EXAMPLE_CLIENT_SECRET',
    // callbackURL: 'http://localhost:3000/auth/example/callback',
    return await this.oauth2Service.verifyClent(req, res);
    // res.redirect(location);
  }

  @Post('authorize')
  @UseGuards(AuthGuard('oauth2'))
  async authorizePost(@Req() req, @Res() res) {
    const { state } = req.query;
    const { decision } = req.body;

    if (decision === 'allow') {
      // The user granted access, so redirect back to the client with an authorization code
      const code = await this.oauth2Service.generateAuthorizationCode(req.user);
      const redirectUri = await this.oauth2Service.validateRedirectUri(
        req.user,
        req.query.redirect_uri,
      );

      const location = `${redirectUri}?code=${code}&state=${state}`;
      res.redirect(location);
    } else {
      // The user denied access, so redirect back to the client with an error message
      const error = 'access_denied';
      const redirectUri = req.query.redirect_uri;

      const location = `${redirectUri}?error=${error}&state=${state}`;
      res.redirect(location);
    }
  }
  @Post('token')
  @UseGuards(AuthGuard('oauth2'))
  async token(@Req() req, @Res() res) {
    const { grant_type, code, refresh_token, redirect_uri } = req.body;

    if (grant_type === 'authorization_code') {
      // Generate a new access token using the authorization code
      const token = await this.oauth2Service.generateToken(
        code,
        redirect_uri,
        req.user,
      );
      res.json(token);
    } else if (grant_type === 'refresh_token') {
      // Generate a new access token using the refresh token
      const token = await this.oauth2Service.generateTokenFromRefreshToken(
        refresh_token,
      );
      res.json(token);
    } else {
      // The grant type is not supported
      res.status(400).json({ error: 'unsupported_grant_type' });
    }
  }
}
