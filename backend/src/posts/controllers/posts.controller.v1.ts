import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostsEntity } from '../entities/posts.entity';
import { User } from '../../users/decorators/user.decorator';
import { ISanitizedUser } from '../../users/interfaces/user.interface';
import { PostsService } from '../posts.service';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { IDeleteResponse } from '../../interfaces/delete-response.interface';
import { LikesService } from '../../likes/likes.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { IPaginatedPosts, IPost } from '../interfaces/post.interface';
import { FindPostDto } from '../dtos/find-post.dto';

@Controller({ path: 'posts', version: '1' })
export class PostsControllerV1 {
  constructor(
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Post()
  async create(
    @User() currentUser: ISanitizedUser,
    @Body() dto: CreatePostDto,
  ): Promise<PostsEntity> {
    return await this.postsService.create(currentUser.id, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Get(':postId')
  async getOne(
    @User() currentUser: ISanitizedUser,
    @Param('postId') postId: string,
  ): Promise<IPost> {
    const post = await this.postsService.getOneDetails(
      { id: Number(postId) },
      currentUser,
    );
    const isLiked = !!(await this.likesService.findOne({
      userId: currentUser.id,
      post: { id: Number(postId) },
    }));
    return { ...post, isLiked };
  }

  @Get()
  async getAll(@Query() findParams?: FindPostDto): Promise<IPaginatedPosts> {
    return await this.postsService.getAll(findParams);
  }

  @UseGuards(JwtAccessGuard)
  @Put(':postId')
  async update(
    @User() currentUser: ISanitizedUser,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
  ): Promise<PostsEntity> {
    const id = Number(postId);
    const post = await this.postsService.getOne({ id });
    if (post.author.id != currentUser.id) {
      throw new ForbiddenException("You can't update this post.");
    }
    return await this.postsService.update({ id }, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':postId')
  async delete(
    @Param('postId') postId: string,
    @User() currentUser: ISanitizedUser,
  ): Promise<IDeleteResponse> {
    const id = Number(postId);
    const post = await this.postsService.getOne({ id });
    if (post.author.id != currentUser.id) {
      throw new ForbiddenException("You can't delete this post.");
    }
    await this.postsService.delete(id);
    return { message: `Post ${id} was successful deleted.` };
  }

  @UseGuards(JwtAccessGuard)
  @Post(':postId/like')
  async likePost(
    @Param('postId') postId: string,
    @User() currentUser: ISanitizedUser,
  ) {
    const post = await this.postsService.getOne({ id: Number(postId) });
    if (post.author.id == currentUser.id)
      throw new ConflictException(`You can't like your own post.`);

    const isLiked = await this.likesService.findOne({
      userId: currentUser.id,
      post: { id: Number(postId) },
    });
    if (isLiked) {
      throw new ConflictException('You have already liked this post.');
    }

    const like = await this.likesService.likePost(currentUser.id, post.id);

    await this.notificationsService.postLikedNotification(
      post.author.id,
      post.id,
    );

    return like;
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':postId/like')
  async removePostLike(
    @Param('postId') postId: string,
    @User() currentUser: ISanitizedUser,
  ): Promise<IDeleteResponse> {
    const post = await this.postsService.getOne({ id: Number(postId) });

    const isLiked = await this.likesService.findOne({
      userId: currentUser.id,
      post: { id: post.id },
    });
    if (!isLiked) {
      throw new ConflictException(`You haven't liked this post.`);
    }

    await this.likesService.removeLike({
      userId: currentUser.id,
      post: { id: post.id },
    });

    return { message: 'Like was deleted.' };
  }
}
