import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ResultData } from '../../common/dto/result-data.dto';
import { UserRole } from './entities/user.role.entity';
import { RoleMenu } from './entities/role.menu.entity';
import { MenuService } from '../menu/menu.service';
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(RoleMenu)
    private roleMenuRepository: Repository<RoleMenu>,
    private menuService: MenuService,
  ) {}
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll(params: any, option: IPaginationOptions) {
    const { name, code, status, create_time } = params;
    // const search = keyword || '';
    // const sort = sortBy || 'create_time';
    // const des = descending || 'ASC';
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    if (name) {
      queryBuilder.andWhere('role.name LIKE :name', { name: '%' + name + '%' });
    }
    if (code) {
      queryBuilder.andWhere('role.code LIKE :code', { code: '%' + code + '%' });
    }
    if (status) {
      queryBuilder.andWhere('role.status = :status', { status: status });
    }
    if (create_time) {
      queryBuilder.andWhere('user.create_time BETWEEN :start AND :end', {
        start: create_time[0],
        end: create_time[1],
      });
    }
    const promise = await paginate<Role>(queryBuilder, option);
    return ResultData.ok({ list: promise.items, ...promise.meta });
  }
  async findByUserId(userid, status) {
    const user_role = await this.userRoleRepository.find({
      where: {
        user_id: userid,
      },
    });
    const roles = this.roleRepository.find({
      where: {
        //查询id为1,2,3的数据
        id: In(user_role.map((item) => item.role_id)),
        status: status,
      },
    });
    return roles;
  }
  async findMenuByRoleIds(roleId) {
    return await this.roleMenuRepository
      .createQueryBuilder('system_role_menu')
      .where('system_role_menu.role_id IN (:...roleId)', { roleId: roleId })
      .getMany();
  }
  async getUserPermission(menu_id: string[], type: number[], status: number) {
    const userPermission = await this.menuService.findByIds(
      menu_id,
      type,
      status,
    );
    return userPermission;
  }
  async getUserMenu(menu_id: string[], type: number[], status: number) {
    return await this.menuService.findListByIds(menu_id, type, status);
  }
  // 查询全部system_role_menu
  async findAllRoleMenu() {
    return await this.roleMenuRepository.find();
  }
  // 查询全部system_user_role
  async findAllUserRole() {
    return await this.userRoleRepository.find();
  }
  // 查询全部system_role
  async findAllRole() {
    return await this.roleRepository.find();
  }
}
