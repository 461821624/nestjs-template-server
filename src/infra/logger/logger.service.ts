import { Injectable } from '@nestjs/common';
import { CreateLoggerDto } from './dto/create-logger.dto';
import { LoggerAccess } from './entities/logger-access.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ResultData } from '../../common/dto/result-data.dto';
import { LoggerPageReqVo } from './vo/logger-page-req.vo';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(LoggerAccess)
    private loggerAccess: Repository<LoggerAccess>,
  ) {}
  async create(createLoggerDto: CreateLoggerDto) {
    return await this.loggerAccess.insert(createLoggerDto);
  }
  async getApiAccessLogPage(params: any, option: IPaginationOptions) {
    const {
      user_id,
      user_type,
      application_name,
      request_url,
      begin_time,
      duration,
      result_code,
    } = params;
    const queryBuilder = this.loggerAccess.createQueryBuilder('logger');
    if (user_id) {
      queryBuilder.andWhere('logger.user_id = :user_id', { user_id: user_id });
    }
    if (user_type) {
      queryBuilder.andWhere('logger.user_type = :user_type', {
        user_type: user_type,
      });
    }
    if (application_name) {
      queryBuilder.andWhere('logger.application_name = :application_name', {
        application_name: application_name,
      });
    }
    if (request_url) {
      queryBuilder.andWhere('logger.request_url LIKE :request_url', {
        request_url: '%' + request_url + '%',
      });
    }
    if (begin_time) {
      queryBuilder.andWhere('logger.begin_time BETWEEN :start AND :end', {
        start: begin_time[0],
        end: begin_time[1],
      });
    }
    if (duration) {
      queryBuilder.andWhere('logger.duration = :duration', {
        duration: duration,
      });
    }
    if (result_code) {
      queryBuilder.andWhere('logger.result_code = :result_code', {
        result_code: result_code,
      });
    }
    const promise = await paginate<LoggerAccess>(queryBuilder, option);
    return ResultData.ok({ list: promise.items, ...promise.meta });
  }
}
