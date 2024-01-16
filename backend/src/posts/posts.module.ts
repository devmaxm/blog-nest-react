import { Module, forwardRef } from '@nestjs/common';
import { PostsControllerV1 } from './controllers/posts.controller.v1';
import { PostsService } from './posts.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './entities/posts.entity';
import { CommentsModule } from '../comments/comments.module';
import { CommentsEntity } from '../comments/entities/comments.entity';
import { LikesModule } from '../likes/likes.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntity, CommentsEntity]),
    UsersModule,
    forwardRef(() => CommentsModule),
    forwardRef(() => LikesModule),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [PostsControllerV1],
  providers: [PostsService],
  exports: [PostsService, TypeOrmModule],
})
export class PostsModule {}
