import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('system_users')
export class User {
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
  @Column({ type: 'varchar', length: 64 })
  creator: string;
  @Column({ type: 'datetime' })
  create_time: Date;
  @Column({ type: 'varchar', length: 64 })
  updater: string;
  @Column({ type: 'datetime' })
  update_time: Date;
  @Exclude()
  @Column({ type: 'tinyint' })
  deleted: number;
}
