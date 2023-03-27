import { Injectable } from '@nestjs/common';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dept } from './entities/dept.entity';
import { DeptListReqVo } from './vo/dept-list-req.vo';
import { ResultData } from '../../common/dto/result-data.dto';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Dept) private deptRepository: Repository<Dept>,
  ) {}
  create(createDeptDto: CreateDeptDto) {
    return 'This action adds a new dept';
  }
  async getDeptList(reqVo: DeptListReqVo) {
    const queryBuilder = await this.deptRepository.createQueryBuilder('dept');
    if (reqVo.status) {
      queryBuilder.andWhere('dept.status = :status', { status: reqVo.status });
    }
    if (reqVo.name) {
      queryBuilder.andWhere('dept.name like :name', {
        name: `%${reqVo.name}%`,
      });
    }
    const dept = await queryBuilder.getMany();

    return ResultData.ok(dept.sort((a, b) => a.sort - b.sort));
  }
  findDeptAll() {
    return `This action returns all dept`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dept`;
  }

  update(id: number, updateDeptDto: UpdateDeptDto) {
    return `This action updates a #${id} dept`;
  }
  getDeptNameById(dept_id: string, deptList: any): string {
    let name = '';
    deptList.forEach((item) => {
      if (item.id == dept_id) {
        return (name = item.name);
      }
    });
    return name;
  }
  //查询指定部门的子部门包括自身
  async findChildDeptIds(deptId: any) {
    return await this.deptRepository
      .createQueryBuilder('dept')
      .where('dept.parent_id >= :deptId', { deptId: deptId })
      .getMany();
    // 筛选出所有parent_id大于等于deptId的部门
    // const deptList = await query.getMany();
    // 过滤除id外的其他属性
  }
  getUserPage() {}
  remove(id: number) {
    return `This action removes a #${id} dept`;
  }
}
