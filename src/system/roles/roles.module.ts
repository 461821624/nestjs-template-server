import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user.role.entity';
import { RoleMenu } from './entities/role.menu.entity';
import { MenuModule } from '../menu/menu.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [TypeOrmModule.forFeature([Role, UserRole, RoleMenu]), MenuModule],
  exports: [RolesService],
})
export class RolesModule {}
