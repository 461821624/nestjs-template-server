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

    // 获取system_user_role缓存
    const system_user_role = JSON.parse(
      await this.client.get(`${config.get('server.name')}:system_user_role`),
    );

    // system_user_role中筛选出user_id等于userId的数据
    const userRole = system_user_role.filter(
      (item) => Number(item.user_id) === userId,
    );
    const system_role = JSON.parse(
      await this.client.get(`${config.get('server.name')}:system_role`),
    );

    // 根据userRole中的role_id和StatusEnum.ENABLE在system_role缓存中筛选出对应id和status的数据
    const roles = system_role.filter(
      (item) =>
        userRole.map((item) => item.role_id).includes(item.id) &&
        item.status === StatusEnum.ENABLE,
    );
    // 获取system_role_menu缓存
    const system_role_menu = JSON.parse(
      await this.client.get(`${config.get('server.name')}:system_role_menu`),
    );

    // 获得用户拥有的菜单列表,只要目录和菜单类型

    // 筛选出system_role_menu中role_id等于roles中id的数据
    const user_menu = system_role_menu.filter((item) =>
      roles.map((item) => item.id).includes(item.role_id),
    );

    // 获取system_menu缓存
    const system_menu = JSON.parse(
      await this.client.get(`${config.get('server.name')}:system_menu`),
    );

    // 筛选出system_menu中id等于user_menu中menu_id并且status等于StatusEnum.ENABLE，type===MenuTypeEnum.DIR||type===MenuTypeEnum.MENU的数据
    const menu_list = system_menu.filter(
      (item) =>
        user_menu.map((item) => Number(item.menu_id)).includes(item.id) &&
        item.status === StatusEnum.ENABLE &&
        (item.type === MenuTypeEnum.DIR || item.type === MenuTypeEnum.MENU),
    );

    const tree = arrayToTree(menu_list, 0);
    return ResultData.ok(tree);
  }
}
