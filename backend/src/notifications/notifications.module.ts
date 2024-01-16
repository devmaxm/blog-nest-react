import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsControllerV1 } from './controllers/notifications.controller';
import { CommentsModule } from '../comments/comments.module';
import { PostsModule } from '../posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsEntity } from './entities/notification.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationsEntity]),
    forwardRef(() => PostsModule),
    UsersModule,
    forwardRef(() => CommentsModule),
  ],
  providers: [NotificationsService],
  controllers: [NotificationsControllerV1],
  exports: [NotificationsService],
})
export class NotificationsModule {}
