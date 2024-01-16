import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostsEntity } from '../entities/posts.entity';
import { User } from '../../users/decorators/user.decorator';
import { IUser } from '../../users/interfaces/user.interface';
import { PostsService } from '../posts.service';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { IDeleteResponse } from '../../interfaces/delete-response.interface';
import { LikesService } from '../../likes/likes.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { IPost } from '../interfaces/post.interface';

@Controller({ path: 'posts', version: '1' })
export class PostsControllerV1 {
  constructor(
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
    private readonly notificationsService: NotificationsService,
  ) { }

  @UseGuards(JwtAccessGuard)
  @Post()
  async create(
    @User() currentUser: IUser,
    @Body() dto: CreatePostDto,
  ): Promise<PostsEntity> {
    return await this.postsService.create(currentUser.id, dto);
  }


  @UseGuards(JwtAccessGuard)
  @Get(':postId')
  async getOne(
    @User() currentUser: IUser,
    @Param('postId') postId: string
  ): Promise<IPost> {
    const post = await this.postsService.getOneDetails({ id: Number(postId) }, currentUser);
    if (!post) {
      throw new HttpException('Post not found.', HttpStatus.NOT_FOUND);
    }
    const isLiked = !!await this.likesService.getOne({
      userId: currentUser.id,
      post: { id: Number(postId) },
    });
    return {...post, isLiked};
  }

  @Get()
  async getAll(): Promise<PostsEntity[]> {
    return await this.postsService.getAll();
  }

  @UseGuards(JwtAccessGuard)
  @Put(':postId')
  async update(
    @User() currentUser: IUser,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
  ): Promise<PostsEntity> {
    const id = Number(postId);
    const post = await this.postsService.getOne({ id });
    if (!post) {
      throw new HttpException('Post not found.', HttpStatus.NOT_FOUND);
    }
    if (post.author.id != currentUser.id) {
      throw new HttpException(
        "You can't update this post.",
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.postsService.update(id, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':postId')
  async delete(
    @Param('postId') postId: string,
    @User() currentUser: IUser,
  ): Promise<IDeleteResponse> {
    const id = Number(postId);
    const post = await this.postsService.getOne({ id });
    if (!post) {
      throw new HttpException('Post not found.', HttpStatus.NOT_FOUND);
    }
    if (post.author.id != currentUser.id) {
      throw new HttpException(
        "You can't delete this post.",
        HttpStatus.FORBIDDEN,
      );
    }
    await this.postsService.delete(id);
    return { message: `Post ${id} was successful deleted.` };
  }

  @UseGuards(JwtAccessGuard)
  @Post(':postId/like')
  async likePost(@Param('postId') postId: string, @User() currentUser: IUser) {
    const post = await this.postsService.getOne({ id: Number(postId) });
    if (!post) throw new HttpException('Post not found.', HttpStatus.NOT_FOUND);
    console.log(post)
    if (post.author.id == currentUser.id)
      throw new HttpException(
        `You can't like your own post.`,
        HttpStatus.CONFLICT,
      );
    const isLiked = await this.likesService.getOne({
      userId: currentUser.id,
      post: { id: Number(postId) },
    });
    if (isLiked)
      throw new HttpException(
        'You have already liked this post.',
        HttpStatus.CONFLICT,
      );
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
    @User() currentUser: IUser,
  ): Promise<IDeleteResponse> {
    const post = await this.postsService.getOne({ id: Number(postId) });
    if (!post) throw new HttpException('Post not found.', HttpStatus.NOT_FOUND);

    const isLiked = await this.likesService.getOne({
      userId: currentUser.id,
      post: { id: Number(postId) },
    });
    if (!isLiked)
      throw new HttpException(
        `You haven't liked this post.`,
        HttpStatus.CONFLICT,
      );
    await this.likesService.removeLike({
      userId: currentUser.id,
      post: { id: Number(postId) },
    });
    return { message: 'Like was deleted.' };
  }
}
