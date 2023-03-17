import { ApiProperty } from '@nestjs/swagger';

export class FindOauth2ClientDto {
  @ApiProperty({ description: 'id' })
  id: string;
  @ApiProperty({ description: '客户端id' })
  client_id: string;
  @ApiProperty({ description: '客户端密钥' })
  secret: string;
  @ApiProperty({ description: '应用名' })
  name: string;
  @ApiProperty({ description: '应用图标' })
  logo: string;
  @ApiProperty({ description: '应用描述' })
  description: string;
  @ApiProperty({ description: '状态' })
  status: number;
  @ApiProperty({ description: '访问令牌的有效期' })
  access_token_validity_seconds: number;
  @ApiProperty({ description: '刷新令牌的有效期' })
  refresh_token_validity_seconds: number;
  @ApiProperty({ description: '可重定向的URI地址' })
  redirect_uris: string;
  @ApiProperty({ description: '授权类型' })
  authorized_grant_types: string;
  @ApiProperty({ description: '授权范围' })
  scopes: string;
  @ApiProperty({ description: '自动通过的授权范围' })
  auto_approve_scopes: string;
  @ApiProperty({ description: '权限' })
  authorities: string;
  @ApiProperty({ description: '资源' })
  resource_ids: string;
  @ApiProperty({ description: '附加信息' })
  additional_information: string;
}
