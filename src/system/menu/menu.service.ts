import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { And, In, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { ResultData } from '../../common/dto/result-data.dto';
import { arrayToTree } from '../../common/utils/arrayToTree';
import { MenuPermissionDto } from './dto/menu-permission.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}
  create(createMenuDto: CreateMenuDto) {
    return 'This action adds a new menu';
  }

  async findAll() {
    const promise = await this.menuRepository.find();
    const arrayToTree1 = arrayToTree(promise, 0);
    // const data = JSON.parse(JSON.stringify(promise));
    // const buildTreeByList1 = buildTreeByList(data);
    return ResultData.ok(arrayToTree1);
  }

  async findOne(id: number) {
    const promise = await this.menuRepository.find();
    const arrayToTree = this.menuArrayToTree(promise);
    return ResultData.ok(arrayToTree);
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }
  //根据id查找菜单权限
  async findByIds(ids: string[], type: number[], status: number) {
    const id = ids.map((item) => item);
    const permission = await this.menuRepository
      .createQueryBuilder('menu')
      .where(
        'menu.id IN (:...ids) AND menu.permission IS NOT NULL AND LENGTH(menu.permission) > 0 AND menu.type IN (:...type) AND menu.status=:status',
        {
          ids: id,
          type,
          status,
        },
      )
      .getMany();
    return permission.map((item) => item.permission);
  }
  async findListByIds(ids: string[], type: number[], status: number) {
    const id = ids.map((item) => item);
    return await this.menuRepository
      .createQueryBuilder('menu')
      .where(
        'menu.id IN (:...ids) AND menu.type IN (:...type) AND menu.status=:status',
        {
          ids: id,
          type,
          status,
        },
      )
      .getMany();
  }
  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
  menuArrayToTree(arr, parent_id = 0) {
    return arr
      .filter((item) => Number(item.parent_id) === parent_id) // 过滤出所有父级匹配的项
      .map((item) => ({
        // id: item.id,
        path: item.path,
        name: item.name,
        //
        // orderNo: item.sort,
        // type: item.type.toString(),
        // createTime: item.create_time,
        component: item.component,
        // status: item.status,
        meta: {
          title: item.locale,
          icon: item.icon,
          // hideChildrenInMenu: item.hideInMenu !== 0,
        },
        children: this.menuArrayToTree(arr, item.id), // 递归转换子级
      }));
  }
}
