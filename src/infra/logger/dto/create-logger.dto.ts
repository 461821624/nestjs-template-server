import { ApiProperty } from '@nestjs/swagger';
export class CreateLoggerDto {
  @ApiProperty({ description: '链路ID' })
  trace_id: string;
  @ApiProperty({ description: '用户ID' })
  user_id: string;
  @ApiProperty({ description: '用户类型' })
  user_type: number;
  @ApiProperty({ description: '应用名称' })
  application_name: string;
  @ApiProperty({ description: '请求方法' })
  request_method: string;
  @ApiProperty({ description: '请求URL' })
  request_url: string;
  @ApiProperty({ description: '请求参数' })
  request_params: string;
  @ApiProperty({ description: '用户IP' })
  user_ip: string;
  @ApiProperty({ description: '用户代理' })
  user_agent: string;
  @ApiProperty({ description: '开始请求时间' })
  begin_time: string;
  @ApiProperty({ description: '结束请求时间' })
  end_time: string;
  @ApiProperty({ description: '执行时长' })
  duration: number;
  @ApiProperty({ description: '结果码' })
  result_code: number;
  @ApiProperty({ description: '结果提示' })
  result_msg: string;
  @ApiProperty({ description: '租户编号' })
  tenant_id: string;
  @ApiProperty({ description: '创建人' })
  creator: string;
  @ApiProperty({ description: '创建时间' })
  create_time: string;
  @ApiProperty({ description: '更新人' })
  updater: string;
  @ApiProperty({ description: '更新时间' })
  update_time: string;
  @ApiProperty({ description: '是否删除' })
  deleted: number;
}
