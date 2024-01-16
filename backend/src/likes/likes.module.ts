import { Module, forwardRef } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CommentsModule } from '../comments/comments.module';
import { PostsModule } from '../posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesEntity } from './entites/likes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikesEntity]),
    forwardRef(() => CommentsModule),
    forwardRef(() => PostsModule),
  ],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
