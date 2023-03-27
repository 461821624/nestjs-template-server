import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeptService } from './dept.service';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResultData } from '../../common/dto/result-data.dto';
import { DeptListReqVo } from './vo/dept-list-req.vo';
import { StatusEnum } from '../../common/enums/status-enum';
import { ApiResult } from 'src/common/decorator/api-result.decorator';
import { Dept } from './entities/dept.entity';
@ApiTags('Dept')
@ApiBearerAuth()
@Controller('dept')
@ApiExtraModels(ResultData, DeptListReqVo, Dept)
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Get('list')
  @ApiOperation({
    summary: '获取部门精简信息列表',
    description: '只包含被开启的部门，主要用于前端的下拉选项',
  })
  @ApiResult(Dept, true)
  async findDeptList(): Promise<ResultData> {
    const reqVo = new DeptListReqVo();
    reqVo.status = StatusEnum.ENABLE;
    return await this.deptService.getDeptList(reqVo);
  }
}
