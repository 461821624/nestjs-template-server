import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
@Entity('system_role_menu')
export class RoleMenu extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;
  @Column({ type: 'bigint', comment: '角色ID' })
  role_id: string;
  @Column({ type: 'bigint', comment: '菜单ID' })
  menu_id: string;
  @Column({ type: 'tinyint', comment: '是否删除' })
  deleted: number;
  @Column({ type: 'bigint' })
  tenant_id: string;
}
