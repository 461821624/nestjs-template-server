import { Type } from 'class-transformer';
import { PageQueryDto } from '../../../common/dto/page-query.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoggerPageReqVo extends PageQueryDto {
  @ApiProperty({ description: '用户id', required: false })
  user_id: string;

  @ApiProperty({ description: '用户类型', required: false })
  @Type(() => Number)
  user_type: number;

  @ApiProperty({ description: '应用名称', required: false })
  application_name: string;

  @ApiProperty({ description: '请求地址，模糊匹配', required: false })
  request_url: string;

  @ApiProperty({ description: '开始请求时间', required: false })
  begin_time: [string, string];

  @ApiProperty({ description: '执行时长', required: false })
  @Type(() => Number)
  duration: number;

  @ApiProperty({ description: '结果码', required: false })
  @Type(() => Number)
  result_code: number;
}
