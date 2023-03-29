import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerAccess } from './entities/logger-access.entity';

@Module({
  controllers: [LoggerController],
  providers: [LoggerService],
  imports: [TypeOrmModule.forFeature([LoggerAccess])],
  exports: [LoggerService],
})
export class LoggerModule {}
