import { ApiProperty } from '@nestjs/swagger';

export class FindUserMenuDto {
  @ApiProperty()
  user_id: string;
}
