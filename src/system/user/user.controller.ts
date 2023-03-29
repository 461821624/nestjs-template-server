import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResultData } from '../../common/dto/result-data.dto';
import { ApiResult } from '../../common/decorator/api-result.decorator';
import { FindUserDao } from './dao/find-user.dao';
import { PageQueryDto } from '../../common/dto/page-query.dto';
import { UserTokenDto } from './dto/user-token.tdo';
import { LoginUserDto } from './dto/login-user.dto';
import { AllowAnon } from '../..//common/decorator/allow-anon.decorator';
import { UserParams, UserPermissionDto } from './dto/user-permission.dto';
import { FindUserMenuDto } from '../menu/dto/find-user-menu.dto';
import { UserPageReqVo } from './vo/user-page-req.vo';
import { DeptService } from '../dept/dept.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@ApiExtraModels(
  ResultData,
  FindUserDao,
  PageQueryDto,
  UserTokenDto,
  LoginUserDto,
  FindUserMenuDto,
  UserPermissionDto,
)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly deptService: DeptService,
  ) {}
  @ApiResult(UserTokenDto)
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @AllowAnon()
  async login(
    @Req() request: Request,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ResultData> {
    return await this.userService.findByUsername(request, loginUserDto);
  }
  @ApiResult(FindUserDao)
  @Get('profile')
  @ApiOperation({ summary: '用户信息' })
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserProfile(@Req() req): Promise<ResultData> {
    return await this.userService.getUserProfile(req.user.userId);
  }

  @Get('list')
  @ApiOperation({ summary: '用户分页列表' })
  @ApiResult(FindUserDao, true, true)
  async findUser(@Query() userPageReqVo: UserPageReqVo): Promise<ResultData> {
    const { pageNo: page, pageSize: limit, ...params } = userPageReqVo;
    let childrenDept = [];
    if (params.deptId) {
      childrenDept = await this.deptService.findChildDeptIds(params.deptId);
    }

    const userList = await this.userService.findUser(params, childrenDept, {
      page,
      limit,
    });
    // new Map();
    userList.list.forEach(async (element) => {
      element.dept = {
        id: element.dept_id,
        name: await this.deptService.getDeptNameById(
          element.dept_id,
          childrenDept,
        ),
      };
    });
    return ResultData.ok(userList);
  }
  @Get('permission')
  @ApiOperation({ summary: '用户的权限列表' })
  @ApiResult(UserPermissionDto)
  async getUserPermission(@Req() req): Promise<ResultData> {
    return await this.userService.getUserPermission(req.user.userId);
  }

  @Get('menu')
  @ApiOperation({ summary: '用户的菜单列表' })
  @ApiResult(FindUserMenuDto, true)
  async getUserMenu(@Req() req): Promise<ResultData> {
    return await this.userService.getUserMenu(req.user.userId);
  }
  // 用户退出
  @Get('logout')
  @ApiOperation({ summary: '用户退出' })
  async logout(): Promise<ResultData> {
    // return await this.userService.logout(req.user.userId);
    return null;
  }
}
