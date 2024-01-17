import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { LikesEntity } from './entites/likes.entity';
import { CommentsService } from '../comments/comments.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikesEntity)
    private readonly likesRepository: Repository<LikesEntity>,

    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {}

  async findOne(
    where: FindOptionsWhere<LikesEntity>,
  ): Promise<LikesEntity | null> {
    return await this.likesRepository.findOne({ where });
  }

  async likePost(userId: number, postId: number): Promise<LikesEntity> {
    const like = new LikesEntity();
    like.userId = userId;

    const post = await this.postsService.getOne({ id: postId });
    like.post = post;

    return this.likesRepository.save(like);
  }

  async likeComment(userId: number, commentId: number): Promise<LikesEntity> {
    const like = new LikesEntity();
    like.userId = userId;

    const comment = await this.commentsService.getOne({ id: commentId });
    like.comment = comment;

    return this.likesRepository.save(like);
  }

  async removeLike(where: FindOptionsWhere<LikesEntity>) {
    const like = await this.likesRepository.findOne({ where });
    if (!like) {
      throw new NotFoundException('Like not found.');
    }
    await this.likesRepository.delete(like.id);
  }
}
