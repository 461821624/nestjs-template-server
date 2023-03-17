import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('system_user_role')
export class UserRole {
  @PrimaryGeneratedColumn()
  id: bigint;
  @Column({ type: 'bigint' })
  user_id: bigint;
  @Column({ type: 'bigint' })
  role_id: bigint;
  @Column({ type: 'varchar', length: 64 })
  creator: string;
  @Column({ type: 'datetime' })
  create_time: string;
  @Column({ type: 'varchar', length: 64 })
  updater: string;
  @Column({ type: 'datetime' })
  update_time: string;
  @Column({ type: 'bit' })
  deleted: boolean;
  @Column({ type: 'bigint' })
  tenant_id: bigint;
}
