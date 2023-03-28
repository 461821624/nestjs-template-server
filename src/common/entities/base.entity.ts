import { Exclude, Type } from 'class-transformer';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @Column({ type: 'varchar', length: 64 })
  creator: string;
  @CreateDateColumn({ type: 'datetime' })
  @Type(() => Date)
  create_time: Date;
  @Column({ type: 'varchar', length: 64 })
  updater: string;
  @UpdateDateColumn({ type: 'datetime' })
  update_time: Date;
  @Exclude()
  @Column({ type: 'tinyint' })
  deleted: number;
}
