import { ApiProperty } from '@nestjs/swagger';

export class FindUserDao {
  @ApiProperty({
    description: '用户id',
  })
  id: bigint;
  @ApiProperty()
  nickname: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  remark: string;
  @ApiProperty()
  dept_id: bigint;
  @ApiProperty()
  post_ids: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  mobile: string;
  @ApiProperty()
  sex: number;
  @ApiProperty()
  avatar: string;
  @ApiProperty()
  status: number;
  @ApiProperty()
  login_ip: string;
  @ApiProperty()
  login_date: string;
  @ApiProperty()
  creator: string;
  @ApiProperty()
  create_time: Date;
  @ApiProperty()
  updater: string;
  @ApiProperty()
  update_time: Date;
  @ApiProperty()
  tenant_id: bigint;
}
