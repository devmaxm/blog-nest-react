import { Module, forwardRef } from '@nestjs/common';
import { CommentsControllerV1 } from './controllers/comments.controller.v1';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './entities/comments.entity';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { LikesModule } from '../likes/likes.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentsEntity]),
    UsersModule,
    forwardRef(() => PostsModule),
    forwardRef(() => LikesModule),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [CommentsControllerV1],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
