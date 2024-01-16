import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';
import { CommentsEntity } from '../../comments/entities/comments.entity';
import { LikesEntity } from '../../likes/entites/likes.entity';

@Entity({ name: 'posts' })
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @OneToMany(() => CommentsEntity, (comment) => comment.post)
  comments: CommentsEntity[];

  @ManyToOne(() => UsersEntity, (user) => user.posts)
  author: UsersEntity;

  @OneToMany(() => LikesEntity, (like) => like.post)
  likes: LikesEntity[];

  likesCount: number;
}
