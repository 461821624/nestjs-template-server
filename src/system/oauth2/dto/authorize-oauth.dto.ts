import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthorizeOAuth2 {
  @ApiProperty({ description: '客户端ID' })
  @IsNotEmpty()
  client_id: string;
  @ApiProperty({ description: '重定向URI' })
  @IsNotEmpty()
  redirect_uri: string;
  @ApiProperty({ description: '鉴权模式' })
  @IsNotEmpty()
  response_type: string;
}
