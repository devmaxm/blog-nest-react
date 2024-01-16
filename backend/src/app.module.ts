import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { NotificationsModule } from './notifications/notifications.module';
import typeormAsyncConfig from './config/typeorm/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: typeormAsyncConfig,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
