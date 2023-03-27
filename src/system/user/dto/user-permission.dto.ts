import { ApiProperty } from '@nestjs/swagger';
export class UserParams {
  @ApiProperty()
  avatar: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  nickname: string;
}
export class RolesParams {
  roles: any;
}
export class PermissionsParams {
  permissions: any;
}
export class UserPermissionDto {
  @ApiProperty()
  permissions: PermissionsParams;
  @ApiProperty()
  roles: RolesParams;
  @ApiProperty()
  user: UserParams;
}
