import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('infra_api_access_log')
export class LoggerAccess extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;
  @Column({ type: 'varchar', length: 64 })
  trace_id: string;
  @Column({ type: 'bigint', nullable: false, default: 0, comment: '用户ID' })
  user_id: string;
  @Column({ type: 'tinyint', nullable: false, default: 0, comment: '用户类型' })
  user_type: number;
  @Column({ type: 'varchar', length: 50 })
  application_name: string;
  @Column({ type: 'varchar', length: 16 })
  request_method: string;
  @Column({ type: 'varchar', length: 255 })
  request_url: string;
  @Column({ type: 'varchar', length: 8000 })
  request_params: string;
  @Column({ type: 'varchar', length: 50 })
  user_ip: string;
  @Column({ type: 'varchar', length: 512 })
  user_agent: string;
  @Column({ type: 'date', comment: '开始请求时间' })
  begin_time: string;
  @Column({ type: 'date', comment: '开始请求时间' })
  end_time: string;
  @Column({ type: 'int', nullable: false, default: 0, comment: '执行时长' })
  duration: number;
  @Column({ type: 'int', nullable: false, default: 0, comment: '结果码' })
  result_code: number;
  @Column({ type: 'varchar', length: 512, comment: '结果提示' })
  result_msg: string;
  @Column({ type: 'bigint', comment: '租户编号' })
  tenant_id: string;
}
