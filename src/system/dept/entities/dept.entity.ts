import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Type } from 'class-transformer';
@Entity('system_dept')
export class Dept extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;
  @Column({ type: 'varchar', length: 30, comment: '部门名称' })
  name: string;
  @Column({ type: 'bigint', comment: '父部门ID' })
  @Type(() => Number)
  parent_id: string;
  @Column({ type: 'int', comment: '父部门名称' })
  sort: number;
  @Column({ type: 'bigint', comment: '负责人' })
  leader_user_id: string;
  @Column({ type: 'varchar', length: 11, comment: '手机号' })
  phone: string;
  @Column({ type: 'varchar', length: 50, comment: '邮箱' })
  email: string;
  @Column({ type: 'tinyint', comment: '状态' })
  status: number;

  tenant_id: string;
}
