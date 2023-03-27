import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('system_users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ type: 'varchar', length: 30 })
  nickname: string;
  @Column({ type: 'varchar', length: 30 })
  username: string;
  @Exclude()
  @Column({ type: 'varchar', length: 100 })
  password: string;
  @Column({ type: 'varchar', length: 500 })
  remark: string;
  @Column({ type: 'bigint' })
  dept_id: string;
  @Column({ type: 'varchar', length: 255 })
  post_ids: string;
  @Column({ type: 'varchar', length: 50 })
  email: string;
  @Column({ type: 'varchar', length: 11 })
  mobile: string;
  @Column({ type: 'tinyint', default: 0 })
  sex: number;
  @Column({ type: 'varchar', length: 100 })
  avatar: string;
  @Column({ type: 'tinyint', default: 0 })
  status: number;
  @Column({ type: 'varchar', length: 50 })
  login_ip: string;
  @Column({ type: 'datetime' })
  login_date: string;
  @Column({ type: 'bigint' })
  tenant_id: string;
  dept: any;
}
