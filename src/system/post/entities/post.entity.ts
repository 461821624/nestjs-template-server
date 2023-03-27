import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('system_post')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;
  @Column({ type: 'varchar', length: 50, comment: '岗位名称' })
  name: string;
  @Column({ type: 'varchar', length: 64, comment: '岗位编码' })
  code: string;
  @Column({ type: 'int', comment: '显示顺序' })
  sort: number;
  @Column({ type: 'tinyint', comment: '状态' })
  status: number;
  @Column({ type: 'bigint', comment: '租户id' })
  tenant_id: string;
  @Column({ type: 'varchar', length: 500, comment: '备注' })
  remark: string;
}
