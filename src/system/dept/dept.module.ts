import { Module } from '@nestjs/common';
import { DeptService } from './dept.service';
import { DeptController } from './dept.controller';
import { Dept } from './entities/dept.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [DeptController],
  providers: [DeptService],
  imports: [TypeOrmModule.forFeature([Dept])],
  exports: [DeptService],
})
export class DeptModule {}
