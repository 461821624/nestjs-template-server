import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from '../entities/post.entity';
export class PostRespDto {
  constructor(post: PostEntity) {
    this.id = post.id;
    this.name = post.name;
  }
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}
