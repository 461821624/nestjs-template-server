import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Tenant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;
  @Column({ type: 'varchar', length: 30 })
  name: string;
  @Column({ type: 'bigint', comment: '联系人的用户编号' })
  contact_user_id: bigint;
  @Column({ type: 'varchar', length: 30, comment: '联系人' })
  contact_name: string;
  @Column({ type: 'varchar', length: 500, comment: '联系手机' })
  contact_mobile: string;
  @Column({ type: 'tinyint', default: 0, comment: '租户状态（0正常 1停用）' })
  status: number;
  @Column({ type: 'varchar', length: 256, comment: '绑定域名' })
  domain: string;
  @Column({ type: 'bigint', comment: '租户套餐编号' })
  package_id;
  @Column({ type: 'datetime', comment: '过期时间' })
  expire_time: string;
  @Column({ type: 'int', comment: '账号数量' })
  account_count: number;
  @Column({ type: 'varchar', length: 64, comment: '创建者' })
  creator: string;
  @Column({ type: 'datetime', comment: '创建时间' })
  create_time: string;
  @Column({ type: 'varchar', length: 64, comment: '更新者' })
  updater: string;
  @Column({ type: 'datetime', comment: '更新时间' })
  update_time: string;
  @Column({ type: 'bit', comment: '是否删除' })
  deleted: number;
}
