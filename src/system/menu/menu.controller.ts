import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiResult } from '../../common/decorator/api-result.decorator';

import { ResultData } from '../../common/dto/result-data.dto';
import { TreeMenuDao } from './dao/tree-menu.dao';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('菜单')
@ApiExtraModels(ResultData, TreeMenuDao)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiResult(TreeMenuDao)
  @Get('list')
  async findAll(): Promise<ResultData> {
    const menu = await this.menuService.findAll();
    return ResultData.ok(menu);
  }
  @ApiResult(TreeMenuDao)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  async findUserMenu(@Request() req): Promise<ResultData> {
    return await this.menuService.findOne(req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
