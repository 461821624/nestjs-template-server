import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '../../../common/enums/status-enum';

export class DeptListReqVo {
  @ApiProperty({ description: '部门名称, 模糊查询', required: false })
  name: string;
  @ApiProperty({ description: '部门状态', enum: StatusEnum, required: false })
  status: number;
}
