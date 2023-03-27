import { Exclude, Transform, Type } from 'class-transformer';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as moment from 'moment';
import { Moment } from 'moment';
export class BaseEntity {
  @Column({ type: 'varchar', length: 64 })
  creator: string;
  @CreateDateColumn({ type: 'datetime' })
  @Type(() => Date)
  @Transform(({ value }) => moment(value).format('YYYY-MM-DD HH:mm:ss'))
  create_time: Date;
  @Column({ type: 'varchar', length: 64 })
  updater: string;
  @UpdateDateColumn({ type: 'datetime' })
  update_time: Date;
  @Exclude()
  @Column({ type: 'tinyint' })
  deleted: number;
}
