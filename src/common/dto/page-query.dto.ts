import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsDefined,
  IsInt,
  IsNotEmpty,
  Min,
  validate,
} from 'class-validator';

export class PageQueryDto {
  @ApiProperty({
    description: '关键字',
    default: '',
    required: false,
  })
  @Allow()
  keyword: string;
  @ApiProperty({ description: '页码', default: 1, required: false })
  @IsNotEmpty()
  pageNo: number;
  @ApiProperty({ description: '每条条数', default: 5, required: false })
  @IsNotEmpty()
  @Allow()
  pageSize: string;
  @ApiProperty({
    description: '排序字段',
    default: 'create_time',
    required: false,
  })
  @Allow()
  sortBy: string;
  @ApiProperty({
    description: '排序方式（true:降序，false：升序）',
    default: 'DESC',
    required: false,
    enum: ['DESC', 'ASC'],
  })
  @Allow()
  descending: string;
}
