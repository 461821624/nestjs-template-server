import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PageQueryDto } from '../../common/dto/page-query.dto';
import {
  ApiExtraModels,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { ResultData } from '../../common/dto/result-data.dto';
import { UserTokenDto } from '../user/dto/user-token.tdo';
import { ApiResult } from '../../common/decorator/api-result.decorator';
import { Role } from './entities/role.entity';
import { RoleQueryPageVo } from './vo/role-query-page.vo';
import { Permission } from '../../common/decorator/permission.decorator';
@ApiTags('Roles')
@ApiExtraModels(ResultData, RoleQueryPageVo, Role)
@Controller('roles')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get('list')
  @ApiOperation({ summary: '角色分页列表' })
  @ApiResult(Role, true, true)
  @Permission('system:role:query')
  async findAll(@Query() pageQueryDto: RoleQueryPageVo): Promise<ResultData> {
    const { pageNo: page, pageSize: limit, ...params } = pageQueryDto;
    return await this.rolesService.findAll(params, { page, limit });
  }
}
