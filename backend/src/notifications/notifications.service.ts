import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsEntity } from './entities/notification.entity';
import { UsersService } from '../users/users.service';
import { NotificationMessageEnum } from './enums/notification-message.enum';
import { CommentsService } from '../comments/comments.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationsEntity)
    private readonly notificationRepository: Repository<NotificationsEntity>,

    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {}

  async getAll(userId: number) {
    return this.notificationRepository.find({
      where: { recipient: { id: userId } },
      relations: ['post', 'comment'],
      order: { createdAt: 'DESC' },
    });
  }

  async commentLikedNotification(
    recipientId: number,
    commentId: number,
  ): Promise<NotificationsEntity> {
    const notification = new NotificationsEntity();
    notification.recipient = await this.usersService.getOne({
      id: recipientId,
    });
    notification.message = NotificationMessageEnum.CommentLiked;
    notification.comment = await this.commentsService.getOne({ id: commentId });
    return await this.notificationRepository.save(notification);
  }

  async replyToCommentNotification(
    recipientId: number,
    commentId: number,
  ): Promise<NotificationsEntity> {
    const notification = new NotificationsEntity();
    notification.recipient = await this.usersService.getOne({
      id: recipientId,
    });
    notification.message = NotificationMessageEnum.ReplyToComment;
    notification.comment = await this.commentsService.getOne({ id: commentId });
    return await this.notificationRepository.save(notification);
  }

  async postLikedNotification(
    recipientId: number,
    postService: number,
  ): Promise<NotificationsEntity> {
    const notification = new NotificationsEntity();
    notification.recipient = await this.usersService.getOne({
      id: recipientId,
    });
    notification.message = NotificationMessageEnum.PostLiked;
    notification.post = await this.postsService.getOne({ id: postService });
    return await this.notificationRepository.save(notification);
  }
}
