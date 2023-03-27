import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, Min } from 'class-validator';

export class PageQueryDto {
  @ApiProperty({ description: '页码', default: 1, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  pageNo: number;
  @ApiProperty({ description: '每条条数', default: 5, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  // @Allow()
  pageSize: number;
}
