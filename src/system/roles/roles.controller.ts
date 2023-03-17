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
import { ApiExtraModels, ApiTags } from "@nestjs/swagger";
import { ResultData } from "../../common/dto/result-data.dto";
import { UserTokenDto } from "../auth/dto/user-token.tdo";
import { ApiResult } from "../../common/decorator/api-result.decorator";
import { Role } from "./entities/role.entity";
@ApiTags('Roles')
@ApiExtraModels(ResultData, PageQueryDto, Role)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get('list')
  @ApiResult(Role, true, true)
  async findAll(@Query() pageQueryDto: PageQueryDto): Promise<ResultData> {
    const { pageNo: page, pageSize: limit, ...params } = pageQueryDto;
    return await this.rolesService.findAll(params, { page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
