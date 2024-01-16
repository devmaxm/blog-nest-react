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
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { CommentsService } from '../comments.service';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { User } from '../../users/decorators/user.decorator';
import { IUser } from '../../users/interfaces/user.interface';
import { PostsService } from '../../posts/posts.service';
import { CommentsEntity } from '../entities/comments.entity';
import { UpdateCommentDto } from '../dtos/update-comment.dto';
import { LikesService } from '../../likes/likes.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { IDeleteResponse } from '../../interfaces/delete-response.interface';

@Controller({ path: 'posts/:postId/comments', version: '1' })
export class CommentsControllerV1 {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
    private readonly notificationsService: NotificationsService,
  ) { }

  @UseGuards(JwtAccessGuard)
  @Post()
  async create(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @User() currentUser: IUser,
  ) {
    let parent: CommentsEntity;

    const post = await this.postsService.getOne({ id: Number(postId) });
    if (!post) throw new HttpException('Post not found.', HttpStatus.NOT_FOUND);

    if (dto.parentId) {
      parent = await this.commentsService.getOne({ id: dto.parentId });
      if (!parent)
        throw new HttpException('Comment not found.', HttpStatus.NOT_FOUND);
    }
    const comment = await this.commentsService.create(
      Number(postId),
      currentUser.id,
      dto,
    );
    if (parent && comment.author.id !== parent.author.id) {
      await this.notificationsService.replyToCommentNotification(
        parent.author.id,
        parent.id,
      );
    }

    return {...comment, children: []};
  }

  @UseGuards(JwtAccessGuard)
  @Put(':commentId')
  async update(
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
    @User() currentUser: IUser,
  ) {
    const comment = await this.commentsService.getOne({
      id: Number(commentId),
    });
    if (!comment)
      throw new HttpException('Comment not found.', HttpStatus.NOT_FOUND);
    if (comment.author.id != currentUser.id)
      throw new HttpException(
        `You can't update this comment.`,
        HttpStatus.FORBIDDEN,
      );
    return await this.commentsService.update(Number(commentId), dto);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':commentId')
  async delete(
    @Param('commentId') commentId: string,
    @User() currentUser: IUser,
  ) {
    const comment = await this.commentsService.getOne({
      id: Number(commentId),
    });
    if (!comment)
      throw new HttpException('Comment not found.', HttpStatus.NOT_FOUND);
    if (comment.author.id != currentUser.id)
      throw new HttpException(
        `You can't delete this comment.`,
        HttpStatus.FORBIDDEN,
      );
    await this.commentsService.delete(Number(commentId));
    return { message: `Comment ${commentId} was successful deleted.` };
  }

  @UseGuards(JwtAccessGuard)
  @Post(':commentId/like')
  async likeComment(
    @Param('commentId') commentId: string,
    @User() currentUser: IUser,
  ) {
    const comment = await this.commentsService.getOne({
      id: Number(commentId),
    });
    if (!comment)
      throw new HttpException('Comment not found.', HttpStatus.NOT_FOUND);
    if (comment.author.id == currentUser.id)
      throw new HttpException(
        `You can't like your own comment.`,
        HttpStatus.CONFLICT,
      );
    const isLiked = await this.likesService.getOne({
      userId: currentUser.id,
      comment: { id: Number(commentId) },
    });
    if (isLiked)
      throw new HttpException(
        'You have already liked this comment.',
        HttpStatus.CONFLICT,
      );
    const like = await this.likesService.likeComment(
      currentUser.id,
      comment.id,
    );
    await this.notificationsService.commentLikedNotification(
      comment.author.id,
      comment.id,
    );
    return like;
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':commentId/like')
  async removeCommentLike(
    @Param('commentId') commentId: string,
    @User() currentUser: IUser,
  ): Promise<IDeleteResponse> {
    const comment = await this.commentsService.getOne({
      id: Number(commentId),
    });
    if (!comment)
      throw new HttpException('Comment not found.', HttpStatus.NOT_FOUND);
    const isLiked = await this.likesService.getOne({
      userId: currentUser.id,
      comment: { id: Number(commentId) },
    });
    if (!isLiked)
      throw new HttpException(
        `You haven't liked this comment.`,
        HttpStatus.CONFLICT,
      );
    await this.likesService.removeLike({
      userId: currentUser.id,
      comment: { id: Number(commentId) },
    });
    return { message: 'Like was deleted.' };
  }
}
