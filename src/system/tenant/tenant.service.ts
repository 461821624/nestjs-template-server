import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantService {
  findAll() {
    return `This action returns all tenant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
