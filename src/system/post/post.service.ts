import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { StatusEnum } from 'src/common/enums/status-enum';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultData } from '../../common/dto/result-data.dto';
import { PostRespDto } from './dto/post-resp.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}
  async getPostList(ids: [], ENABLE) {
    const post = await this.postRepository.createQueryBuilder('post');
    if (ids) {
      post.andWhere('post.id in (:...ids)', { ids });
    }
    if (ENABLE) {
      post.andWhere('post.status = :status', { status: ENABLE });
    }
    const post_res = await post.getMany();
    return ResultData.ok(post_res.map((post) => new PostRespDto(post)));
  }
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
