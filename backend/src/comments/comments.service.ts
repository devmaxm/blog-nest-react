import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentsEntity } from './entities/comments.entity';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { ICommentFindOptions } from './interfaces/comment-find-options.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: TreeRepository<CommentsEntity>,

    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    postId: number,
    authorId: number,
    dto: CreateCommentDto,
  ): Promise<CommentsEntity> {
    const { parentId, ...commentData } = dto;
    const post = await this.postsService.getOne({ id: postId });
    const author = await this.usersService.getOneSanitized({ id: authorId });
    const newComment = new CommentsEntity();
    Object.assign(newComment, commentData);
    newComment.post = post;
    newComment.author = author;

    if (parentId) {
      const parent = await this.commentsRepository.findOne({
        where: { id: parentId },
      });
      newComment.parent = parent;
    }
    const comment = await this.commentsRepository.save(newComment);
    delete comment.post;
    if (comment.parent) {
      delete comment.parent.body;
      delete comment.parent.createdAt;
    }
    return { ...comment, likesCount: 0 };
  }

  async getOne(where: ICommentFindOptions): Promise<CommentsEntity> {
    const comment = await this.commentsRepository.findOne({
      where,
      relations: ['author'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }
    return comment;
  }

  async getAll(
    postId: number,
    currentUserId: number,
  ): Promise<CommentsEntity[]> {
    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .select([
        'comment.id',
        'comment.body',
        'comment.createdAt',
        'author.id',
        'parent.id',
        'author.username',
      ])
      .leftJoin('comment.author', 'author')
      .leftJoin('comment.parent', 'parent')
      .loadRelationCountAndMap('comment.likesCount', 'comment.likes')
      .leftJoinAndSelect('comment.likes', 'like', 'like.userId = :userId', {
        userId: currentUserId,
      })
      .where('comment.postId = :postId', { postId })
      .groupBy('comment.id, author.id, like.id, parent.id')
      .getMany();

    for (const comment of comments) {
      const isLiked =
        comment.likes &&
        comment.likes.some((like) => like.userId === currentUserId);
      comment.isLiked = isLiked || false;
      delete comment.likes;
    }

    return this.buildTree(comments);
  }

  private buildTree(comments: CommentsEntity[]): CommentsEntity[] {
    const tree: CommentsEntity[] = [];

    const commentsMap = new Map<number, CommentsEntity>();

    for (const comment of comments) {
      commentsMap.set(comment.id, { ...comment, children: [] });
    }

    for (const comment of comments) {
      if (comment.parent) {
        const parent = commentsMap.get(comment.parent.id);
        if (parent) {
          parent.children.push(commentsMap.get(comment.id));
        }
      } else {
        tree.push(commentsMap.get(comment.id));
      }
    }

    return tree;
  }

  async update(
    commentId: number,
    dto: UpdateCommentDto,
  ): Promise<CommentsEntity> {
    const comment = await this.getOne({ id: commentId });
    if (!comment) {
      return null;
    }
    Object.assign(comment, dto);
    return await this.commentsRepository.save(comment);
  }

  async delete(commentId: number) {
    await this.commentsRepository
      .createQueryBuilder()
      .delete()
      .where('id = :commentId', { commentId })
      .execute();
  }
}
