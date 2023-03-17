import { Column } from 'typeorm';

export class BaseEntity {
  @Column({ type: 'varchar', length: 64 })
  creator: string;
  @Column({ type: 'datetime' })
  create_time: Date;
  @Column({ type: 'varchar', length: 64 })
  updater: string;
  @Column({ type: 'datetime' })
  update_time: Date;
  @Column({ type: 'tinyint' })
  deleted: number;
}
