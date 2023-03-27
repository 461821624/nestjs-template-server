import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../system/user/user.service';
import { RolesService } from '../../system/roles/roles.service';
import { StatusEnum } from '../enums/status-enum';
import { MenuTypeEnum } from '../enums/menu-type';
@Injectable()
// q: 如何使用这个guard
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(RolesService) private readonly rolesService: RolesService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );
    if (!requiredPermission) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    console.log(user);
    const roles = await this.rolesService.findByUserId(
      user.userId,
      StatusEnum.ENABLE,
    );
    const type = [MenuTypeEnum.DIR, MenuTypeEnum.MENU, MenuTypeEnum.BUTTON];
    // 3. 通过roles_id获取菜单id
    const user_menu = await this.rolesService.findMenuByRoleIds(
      (await roles).map((item) => item.id),
    );
    //4. 通过菜单id获取permission
    const permissions = await this.rolesService.getUserPermission(
      user_menu.map((item) => item.menu_id),
      type,
      StatusEnum.ENABLE,
    );

    return permissions.includes(requiredPermission);
  }
}
