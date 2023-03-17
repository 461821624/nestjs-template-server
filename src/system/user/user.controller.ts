import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResultData } from '../../common/dto/result-data.dto';
import { ApiResult } from '../../common/decorator/api-result.decorator';
import { FindUserDao } from './dao/find-user.dao';
import { PageQueryDto } from '../../common/dto/page-query.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@ApiExtraModels(ResultData, FindUserDao, PageQueryDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResult(FindUserDao)
  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  async getUserProfile(@Request() req): Promise<ResultData> {
    return await this.userService.getUserProfile(req.user.userId);
  }
  //
  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  @ApiResult(FindUserDao, true, true)
  findUser(@Query() pageQueryDto: PageQueryDto): Promise<ResultData> {
    const { pageNo: page, pageSize: limit, ...params } = pageQueryDto;
    return this.userService.findUser(params, { page, limit });
  }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
