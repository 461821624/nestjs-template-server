import { Controller, Get, Query } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { CreateLoggerDto } from './dto/create-logger.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResultData } from '../../common/dto/result-data.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { PageQueryDto } from '../../common/dto/page-query.dto';
import { LoggerPageReqVo } from './vo/logger-page-req.vo';
import { ApiResult } from '../../common/decorator/api-result.decorator';
import { Permission } from '../../common/decorator/permission.decorator';
@ApiExtraModels(ResultData, CreateLoggerDto, PageQueryDto)
@Controller('logger')
@ApiTags('Logger')
@ApiBearerAuth()
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get('list')
  @ApiOperation({ summary: '获取api访问日志分页列表' })
  @Permission('infra:api-access-log:query')
  @ApiResult(CreateLoggerDto, true, true)
  pageList(@Query() loggerPageReqVo: LoggerPageReqVo): Promise<ResultData> {
    const { pageNo: page, pageSize: limit, ...params } = loggerPageReqVo;
    return this.loggerService.getApiAccessLogPage(params, { page, limit });
  }
}
