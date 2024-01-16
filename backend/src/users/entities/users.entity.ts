import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostsEntity } from '../../posts/entities/posts.entity';
import { CommentsEntity } from '../../comments/entities/comments.entity';

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false, unique: true, select: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @Column({ nullable: true, default: null, select: false })
  refreshToken: string | null;

  @OneToMany(() => PostsEntity, (post) => post.author)
  posts: PostsEntity[];

  @OneToMany(() => CommentsEntity, (comment) => comment.author)
  comments: CommentsEntity[];
}
