import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PageQueryDto } from '../../../common/dto/page-query.dto';

export class RoleQueryPageVo extends PageQueryDto {
  @ApiProperty({
    description: '角色名称,模糊匹配',
    required: false,
  })
  name: string;
  @ApiProperty({
    description: '角色编码,模糊匹配',
    required: false,
  })
  code: string;
  @ApiProperty({
    description: '角色状态,参见 CommonStatusEnum 枚举类',
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
}
