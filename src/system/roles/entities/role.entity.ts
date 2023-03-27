import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Type } from 'class-transformer';

@Entity('system_role')
export class Role {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;
  @Column({ type: 'varchar', length: 30, comment: '角色名称' })
  name: string;
  @Column({ type: 'varchar', length: 100, comment: '角色权限字符串' })
  code: string;
  @Column({ type: 'int' })
  sort: number;
  @Column({
    type: 'tinyint',
    comment:
      '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
  })
  data_scope: number;
  @Column({ type: 'varchar', length: 500, comment: '数据范围(指定部门数组)' })
  data_scope_dept_ids: string;
  @Column({ type: 'tinyint', comment: '角色状态（0正常 1停用）' })
  status: string;
  @Column({ type: 'tinyint', comment: '角色类型' })
  type: number;
  @Column({ type: 'varchar', comment: '备注', length: 500 })
  remark: string;
  @Column({ type: 'varchar', comment: '创建者', length: 64 })
  creator: string;
  @Column({ type: 'datetime', comment: '创建时间' })
  create_time: string;
  @Column({ type: 'varchar', comment: '更新者', length: 64 })
  updater: string;
  @Column({ type: 'datetime', comment: '更新时间' })
  update_time: string;
  @Column({ type: 'bit', comment: '是否删除' })
  @Exclude()
  // @OneToMany(type => Role, role => role.deleted)
  deleted: number;
  @Column({ type: 'bigint', comment: '租户编号' })
  tenant_id: bigint;
}
