import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('system_oauth2_client')
export class Oauth2Client {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '自增主键' })
  id: string;
  @Column({ type: 'varchar', length: 255, comment: '客户端id' })
  client_id: string;
  @Column({ type: 'varchar', length: 255, comment: '客户端密钥' })
  secret: string;
  @Column({ type: 'varchar', length: 255, comment: '应用名' })
  name: string;
  @Column({ type: 'varchar', length: 255, comment: '应用图标' })
  logo: string;
  @Column({ type: 'varchar', length: 255, comment: '应用描述' })
  description: string;
  @Column({ type: 'tinyint', comment: '状态' })
  status: number;
  @Column({ type: 'int', comment: '访问令牌的有效期' })
  access_token_validity_seconds: number;
  @Column({ type: 'int', comment: '刷新令牌的有效期' })
  refresh_token_validity_seconds: number;
  @Column({ type: 'varchar', length: 255, comment: '可重定向的URI地址' })
  redirect_uris: string;
  @Column({ type: 'varchar', length: 255, comment: '授权类型' })
  authorized_grant_types: string;
  @Column({ type: 'varchar', length: 255, comment: '授权范围' })
  scopes: string;
  @Column({ type: 'varchar', length: 255, comment: '自动通过的授权范围' })
  auto_approve_scopes: string;
  @Column({ type: 'varchar', length: 255, comment: '权限' })
  authorities: string;
  @Column({ type: 'varchar', length: 255, comment: '资源' })
  resource_ids: string;
  @Column({ type: 'varchar', length: 4096, comment: '附加信息' })
  additional_information: string;

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
