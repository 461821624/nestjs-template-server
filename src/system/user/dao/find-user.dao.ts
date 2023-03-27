import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class FindUserDao {
  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.username = user.username;
    this.remark = user.remark;
    this.dept_id = user.dept_id;
    this.email = user.email;
    this.mobile = user.mobile;
    this.sex = user.sex;
    this.avatar = user.avatar;
    this.status = user.status;
    this.login_ip = user.login_ip;
    this.create_time = user.create_time;
    // this.dept = { id: user.dept_id, name: '' };
    this.loginDate = user.login_date;
    this.postIds = JSON.parse(user.post_ids);
  }
  @ApiProperty({
    description: '用户id',
  })
  id: string;
  @ApiProperty()
  nickname: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  remark: string;
  @ApiProperty()
  dept_id: string;
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
  create_time: Date;
  @ApiProperty()
  dept: { id: FindUserDao['dept_id']; name: string };
  @ApiProperty()
  loginDate: string;
  @ApiProperty()
  postIds: number[];
}
