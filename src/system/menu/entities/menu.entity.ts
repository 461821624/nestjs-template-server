import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn, TreeChildren } from 'typeorm';
@Entity('system_menu')
export class Menu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ type: 'varchar', length: 200 })
  path: string;
  @Column({ type: 'varchar', length: 50, comment: '菜单名称' })
  name: string;
  @Column({ type: 'tinyint', comment: '菜单类型' })
  type: string;
  @Column({ type: 'varchar', length: 100, comment: '权限标识' })
  role: string;
  @Column({ type: 'int', comment: '显示顺序' })
  sort: number;
  @Column({ type: 'bigint', comment: '父菜单ID' })
  parent_id: string;
  @Column({ type: 'varchar', length: 100, comment: 'icon' })
  icon: string;
  @Column({ type: 'varchar', length: 255, comment: '组件路径' })
  component: string;
  @Column({ type: 'tinyint', comment: '菜单状态' })
  status: number;
  @Column({ type: 'tinyint', comment: '是否缓存' })
  ignoreCache: number;
  @Column({ type: 'tinyint', comment: '是否显示' })
  hideInMenu: number;
  @Column({ type: 'varchar', length: 255, comment: '语言包键名' })
  locale;
  @TreeChildren()
  children: Menu[];
}
