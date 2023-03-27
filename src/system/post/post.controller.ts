import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResultData } from '../../common/dto/result-data.dto';
import { ApiResult } from '../../common/decorator/api-result.decorator';
import { StatusEnum } from '../../common/enums/status-enum';
import { PostRespDto } from './dto/post-resp.dto';
@Controller('post')
@ApiTags('Post')
@ApiBearerAuth()
@Controller('dept')
@ApiExtraModels(ResultData, PostEntity, PostRespDto)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('list')
  @ApiResult(PostRespDto, true)
  @ApiOperation({
    summary: '获取岗位精简信息列表',
    description: '只包含被开启的岗位，主要用于前端的下拉选项',
  })
  async findPostList(): Promise<ResultData> {
    return await this.postService.getPostList(null, StatusEnum.ENABLE);
  }
}
