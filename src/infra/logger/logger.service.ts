import { Injectable } from '@nestjs/common';
import { CreateLoggerDto } from './dto/create-logger.dto';
import { UpdateLoggerDto } from './dto/update-logger.dto';
import { LoggerAccess } from './entities/logger-access.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(LoggerAccess)
    private loggerAccess: Repository<LoggerAccess>,
  ) {}
  async create(createLoggerDto: CreateLoggerDto) {
    return await this.loggerAccess.create(createLoggerDto);
  }

  findAll() {
    return `This action returns all logger`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logger`;
  }

  update(id: number, updateLoggerDto: UpdateLoggerDto) {
    return `This action updates a #${id} logger`;
  }

  remove(id: number) {
    return `This action removes a #${id} logger`;
  }
}
