import { ApiProperty } from '@nestjs/swagger';
import { PageQueryDto } from '../../../common/dto/page-query.dto';
import { StatusEnum } from '../../../common/enums/status-enum';
import { Allow, IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class UserPageReqVo extends PageQueryDto {
  @ApiProperty({
    description: '用户账号,模糊匹配',
    required: false,
  })
  username: string;
  @ApiProperty({
    description: '手机号码,模糊匹配',
    required: false,
  })
  mobile: string;
  @ApiProperty({
    enum: StatusEnum,
    description: '展示状态,参见 CommonStatusEnum 枚举类',
    required: false,
  })
  @Type(() => Number)
  status: number;

  @ApiProperty({
    description: '创建时间[2022-07-01 00:00:00,2022-07-01 23:59:59]',
    type: [String],
    required: false,
  })
  createTime: string[];

  @ApiProperty({
    description: '部门编号,同时筛选子部门',
    required: false,
  })
  @Type(() => Number)
  deptId: number;
}
