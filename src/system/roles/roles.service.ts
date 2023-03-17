import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ResultData } from "../../common/dto/result-data.dto";
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>, // private iPaginationOptions: IPaginationOptions,
  ) {}
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll(params: any, option: IPaginationOptions) {
    const { keyword, sortBy, descending } = params;
    const search = keyword || '';
    const sort = sortBy || 'create_time';
    const des = descending || 'ASC';
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    if (search) {
      queryBuilder
        .where('role.name LIKE :name', { name: '%' + search + '%' })
        .andWhere('role.deleted = :deleted', { deleted: 0 })
        .orderBy(`role.${sort}`, des); // Or whatever you need to do
    } else {
      queryBuilder
        .orderBy(`role.${sort}`, des)
        .where('role.deleted = :deleted', { deleted: 0 }); // Or whatever you need to do
    }
    const promise = await paginate<Role>(queryBuilder, option);
    return ResultData.ok({ list: promise.items, ...promise.meta });
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
