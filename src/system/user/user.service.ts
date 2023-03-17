import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import * as config from 'config';
import { ResultData } from '../../common/dto/result-data.dto';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';
import { ApiHttpCode } from '../../common/enums/api-http-code';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRedis() private readonly client: Redis,
  ) {}

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findByUsername(username): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async getUserProfile(id: any) {
    const result = await this.client.get(
      `${config.get('server.name')}:user_id`,
    );
    if (!result) {
      const user = await this.usersRepository.findOneBy({
        id: id,
      });
      await this.client.set(
        `${config.get('server.name')}:user_id`,
        JSON.stringify(user),
      );
      return ResultData.ok(user);
    }

    return ResultData.ok(JSON.parse(result));
  }

  async findUser(params: any, option: IPaginationOptions) {
    const { keyword, sortBy, descending } = params;
    const search = keyword || '';
    const sort = sortBy || 'create_time';
    const des = descending || 'ASC';
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    if (search) {
      queryBuilder
        .where('user.name LIKE :name', { name: '%' + search + '%' })
        .andWhere('user.deleted = :deleted', { deleted: 0 })
        .orderBy(`user.${sort}`, des); // Or whatever you need to do
    } else {
      queryBuilder
        .orderBy(`user.${sort}`, des)
        .where('user.deleted = :deleted', { deleted: 0 }); // Or whatever you need to do
    }
    const promise = await paginate<User>(queryBuilder, option);
    return ResultData.ok({ list: promise.items, ...promise.meta });
  }

  async findByUser(username: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
