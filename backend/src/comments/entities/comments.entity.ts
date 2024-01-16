import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';
import { PostsEntity } from '../../posts/entities/posts.entity';
import { LikesEntity } from '../../likes/entites/likes.entity';

@Entity({ name: 'comments' })
@Tree('materialized-path')
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  body: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @ManyToOne(() => UsersEntity)
  author: UsersEntity;

  @TreeParent()
  parent: CommentsEntity;

  @TreeChildren()
  children: CommentsEntity[];

  @ManyToOne(() => PostsEntity, (post) => post.comments)
  post: PostsEntity;

  @OneToMany(() => LikesEntity, (like) => like.comment)
  likes: LikesEntity[];

  likesCount: number;

  isLiked: boolean
}
