import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostsEntity } from '../../posts/entities/posts.entity';
import { CommentsEntity } from '../../comments/entities/comments.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { NotificationMessageEnum } from '../enums/notification-message.enum';

@Entity({ name: 'notifications' })
export class NotificationsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: NotificationMessageEnum })
  message: NotificationMessageEnum;

  @Column({ default: false })
  isChecked: boolean;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @ManyToOne(() => UsersEntity)
  @JoinColumn()
  recipient: UsersEntity;

  @ManyToOne(() => PostsEntity, { nullable: true })
  post: PostsEntity | null;

  @ManyToOne(() => CommentsEntity, { nullable: true })
  comment: CommentsEntity | null;
}
