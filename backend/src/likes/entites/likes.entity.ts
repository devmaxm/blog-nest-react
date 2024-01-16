import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostsEntity } from '../../posts/entities/posts.entity';
import { CommentsEntity } from '../../comments/entities/comments.entity';

@Entity()
export class LikesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => PostsEntity, (post) => post.likes)
  post: PostsEntity | null;

  @ManyToOne(() => CommentsEntity, (comment) => comment.likes)
  comment: CommentsEntity | null;
}
