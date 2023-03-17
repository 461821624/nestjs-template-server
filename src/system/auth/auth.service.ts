import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResultData } from '../../common/dto/result-data.dto';
import { ApiHttpCode } from '../../common/enums/api-http-code';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRedis() private readonly client: Redis,
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  async findByUsername(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user)
      return ResultData.fail(
        ApiHttpCode.USER_PASSWORD_INVALID,
        '帐号或密码错误',
      );
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return ResultData.fail(
        ApiHttpCode.USER_PASSWORD_INVALID,
        '帐号或密码错误',
      );
    if (user.status === 1)
      return ResultData.fail(ApiHttpCode.USER_ACCOUNT_FORBIDDEN);
    // ResultData
    // {

    const access_token = await this.jwtService.signAsync({
      username: user.username,
      sub: user.id,
    });
    return ResultData.ok({ access_token });
  }
}
