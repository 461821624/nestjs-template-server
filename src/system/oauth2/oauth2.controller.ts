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
  root(
    @Query() authorizeOAuth2: AuthorizeOAuth2,
    @Request() req,
    @Res() res: Response,
  ) {
    return this.oauth2Service.authorize(authorizeOAuth2, req, res);
  }
  @Post('authorize')
  authorizeLogin(@Body() createCatDto: any) {
    console.log(createCatDto);
    return null;
  }
  // findOne(@Param('id') id: string) {
  //   return this.oauth2Service.findOne(+id);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oauth2Service.remove(+id);
  }
}
