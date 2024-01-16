import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  ForbiddenException,
  Param,
  Post,
  Put,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { CommentsService } from '../comments.service';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { User } from '../../users/decorators/user.decorator';
import { ISanitizedUser } from '../../users/interfaces/user.interface';
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
  ) {}

  @UseGuards(JwtAccessGuard)
  @Post()
  async create(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @User() currentUser: ISanitizedUser,
  ) {
    let parent: CommentsEntity;

    const post = await this.postsService.getOne({ id: Number(postId) });

    if (dto.parentId) {
      parent = await this.commentsService.getOne({ id: dto.parentId });
      if (!parent) throw new NotFoundException('Comment not found.');
    }
    const comment = await this.commentsService.create(
      post.id,
      currentUser.id,
      dto,
    );
    if (parent && comment.author.id !== parent.author.id) {
      await this.notificationsService.replyToCommentNotification(
        parent.author.id,
        parent.id,
      );
    }

    return { ...comment, children: [] };
  }

  @UseGuards(JwtAccessGuard)
  @Put(':commentId')
  async update(
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
    @User() currentUser: ISanitizedUser,
  ) {
    const comment = await this.commentsService.getOne({
      id: Number(commentId),
    });
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }
    if (comment.author.id != currentUser.id) {
      throw new ForbiddenException("You can't update this comment.");
    }
    return await this.commentsService.update(Number(commentId), dto);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':commentId')
  async delete(
    @Param('commentId') commentId: string,
    @User() currentUser: ISanitizedUser,
  ) {
    const comment = await this.commentsService.getOne({
      id: Number(commentId),
    });
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }
    if (comment.author.id != currentUser.id) {
      throw new ForbiddenException(`You can't delete this comment.`);
    }
    await this.commentsService.delete(Number(commentId));
    return { message: `Comment ${commentId} was successful deleted.` };
  }

  @UseGuards(JwtAccessGuard)
  @Post(':commentId/like')
  async likeComment(
    @Param('commentId') commentId: string,
    @User() currentUser: ISanitizedUser,
  ) {
    const comment = await this.commentsService.getOne({
      id: Number(commentId),
    });
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }
    if (comment.author.id == currentUser.id) {
      throw new ConflictException(`You can't like your own comment.`);
    }
    const isLiked = await this.likesService.findOne({
      userId: currentUser.id,
      comment: { id: Number(commentId) },
    });
    if (isLiked) {
      throw new ConflictException('You have already liked this comment.');
    }
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
    @User() currentUser: ISanitizedUser,
  ): Promise<IDeleteResponse> {
    const comment = await this.commentsService.getOne({
      id: Number(commentId),
    });
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    const isLiked = await this.likesService.findOne({
      userId: currentUser.id,
      comment: { id: Number(commentId) },
    });
    if (!isLiked) {
      throw new ConflictException(`You haven't liked this comment.`);
    }

    await this.likesService.removeLike({
      userId: currentUser.id,
      comment: { id: Number(commentId) },
    });

    return { message: 'Like was deleted.' };
  }
}
