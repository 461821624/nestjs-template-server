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
import { JwtService } from '@nestjs/jwt';
import { FindUserDao } from './dao/find-user.dao';
import { LoginUserDto } from './dto/login-user.dto';
import { UserParams, UserPermissionDto } from './dto/user-permission.dto';
import { RolesService } from '../roles/roles.service';
import { StatusEnum } from '../../common/enums/status-enum';
import { MenuTypeEnum } from '../../common/enums/menu-type';
import { arrayToTree } from '../../common/utils/arrayToTree';
import { DeptService } from '../dept/dept.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRedis() private readonly client: Redis,
    private jwtService: JwtService,
    private readonly rolesService: RolesService,
    private readonly deptService: DeptService,
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

  validateUsername(username, tenant_id): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        username: username,
        tenant_id: tenant_id ? tenant_id : '1',
      },
    });
  }
  /**
   *  用户登录
   * @param loginUserDto 登录参数
   * @returns access_token token
   */
  async findByUsername(loginUserDto: LoginUserDto) {
    const { username, password, tenant_id } = loginUserDto;
    console.log(username, password, tenant_id);
    const user = await this.validateUsername(username, tenant_id);
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

    const access_token = await this.jwtService.signAsync({
      username: user.username,
      sub: user.id,
    });
    return ResultData.ok({ access_token });
  }
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
      return ResultData.ok(new FindUserDao(user));
    }

    return ResultData.ok(JSON.parse(result));
  }

  async findUser(params: any, childrenDept = null, option: IPaginationOptions) {
    const { username, mobile, status, createTime, deptId } = params;
    // const search = keyword || '';
    // const sort = sortBy || 'create_time';
    // const des = descending || 'ASC';
    // let deptIds = [];
    // if (deptId) {
    //   //查找出所有子部门id，包括自身
    //   deptIds = await this.deptService.findChildDeptIds(deptId);
    //   deptIds.push(deptId);
    // }
    // console.log(deptIds);
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: '%' + username + '%',
      });
    }
    if (mobile) {
      queryBuilder.andWhere('user.mobile LIKE :mobile', {
        mobile: '%' + mobile + '%',
      });
    }
    if (status) {
      queryBuilder.andWhere('user.status = :status', { status: status });
    }
    if (childrenDept && childrenDept.length > 0) {
      queryBuilder.andWhere('user.dept_id IN (:...deptIds)', {
        deptIds: childrenDept.map((item) => item.id),
      });
    }
    // 查询时间createTime[0]到createTime[1]
    if (createTime) {
      queryBuilder.andWhere('user.create_time BETWEEN :start AND :end', {
        start: createTime[0],
        end: createTime[1],
      });
    }

    queryBuilder.andWhere('user.deleted = :deleted', { deleted: 0 });
    queryBuilder.andWhere('user.tenant_id = :tenant_id', { tenant_id: 1 });
    // if (search) {
    //   queryBuilder
    //     .where('user.name LIKE :name', { name: '%' + search + '%' })
    //     .andWhere('user.deleted = :deleted', { deleted: 0 })
    //     .orderBy(`user.${sort}`, des); // Or whatever you need to do
    // } else {
    //   queryBuilder
    //     .orderBy(`user.${sort}`, des)
    //     .where('user.deleted = :deleted', { deleted: 0 }); // Or whatever you need to do
    // }
    const user = await paginate<User>(queryBuilder, option);
    return {
      list: await user.items.map((item) => new FindUserDao(item)),
      ...user.meta,
    };
    // return ResultData.ok({
    //   list: await promise.items.map((item) => new FindUserDao(item)),
    //   ...promise.meta,
    // });
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
  async getUserPermission(userId: string) {
    // 1. 从redis中获取用户信息

    const { id, nickname, avatar }: UserParams = JSON.parse(
      await this.client.get(`${config.get('server.name')}:user_id`),
    );
    // 2. 获取用户角色信息

    const roles = await this.rolesService.findByUserId(
      userId,
      StatusEnum.ENABLE,
    );
    const type = [MenuTypeEnum.DIR, MenuTypeEnum.MENU, MenuTypeEnum.BUTTON];
    // 3. 通过roles_id获取菜单id
    const user_menu = await this.rolesService.findMenuByRoleIds(
      (await roles).map((item) => item.id),
    );
    //4. 通过菜单id获取permission
    const permissions = await this.rolesService.getUserPermission(
      user_menu.map((item) => item.menu_id),
      type,
      StatusEnum.ENABLE,
    );
    return ResultData.ok({
      user: { id, nickname, avatar },
      roles: (await roles).map((item) => item.code),
      permissions,
    });
  }
  /**
   * 校验token
   * @param token
   * @returns id|null
   */
  verifyToken(token: string): string {
    try {
      if (!token) return null;
      const id = this.jwtService.verify(token.replace('Bearer ', ''));
      return id;
    } catch (error) {
      return null;
    }
  }
  async getUserMenu(userId: any) {
    // 获得角色列表
    const roles = await this.rolesService.findByUserId(
      userId,
      StatusEnum.ENABLE,
    );
    // 获得用户拥有的菜单列表,只要目录和菜单类型
    const type = [MenuTypeEnum.DIR, MenuTypeEnum.MENU];
    const user_menu = await this.rolesService.findMenuByRoleIds(
      (await roles).map((item) => item.id),
    );
    const menu_list = await this.rolesService.getUserMenu(
      user_menu.map((item) => item.menu_id),
      type,
      StatusEnum.ENABLE,
    );
    //menu转换成 Tree 结构返回
    // new Tree('closure-table', 'id', 'parent_id', 'children').transform();
    const tree = arrayToTree(menu_list, 0);
    return ResultData.ok(tree);
  }
}
