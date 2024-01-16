import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PostsEntity } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { CommentsService } from '../comments/comments.service';
import { IUser } from '../users/interfaces/user.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,

    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,

    private readonly usersService: UsersService,
  ) {}

  async create(authorId: number, data: CreatePostDto): Promise<PostsEntity> {
    const author = await this.usersService.getOneClean({ id: authorId });
    if (!author) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    const newPost = new PostsEntity();
    Object.assign(newPost, data);
    newPost.author = author;
    return await this.postsRepository.save(newPost);
  }

  async getOne(where: FindOptionsWhere<PostsEntity>): Promise<PostsEntity | null> {
    return await this.postsRepository.findOne({where, relations: ['author']})
  }
  async getOneDetails(
    where: FindOptionsWhere<PostsEntity>,
    currentUser: IUser
  ): Promise<PostsEntity | null> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .where('post.id = :postId', { postId: where.id })
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .getOne();

    const comments = await this.commentsService.getAll(post.id, currentUser.id);
    post.comments = comments;
    return post;
  }

  async getAll(): Promise<PostsEntity[]> {
    return await this.postsRepository.find({
      relations: ['author'],
    });
  }

  async update(
    postId: number,
    data: UpdatePostDto,
  ): Promise<PostsEntity | null> {
    const post = await this.getOne({ id: postId });
    if (!post) {
      return null;
    }
    Object.assign(post, data);
    return await this.postsRepository.save(post);
  }

  async delete(postId: number): Promise<void> {
    await this.postsRepository
      .createQueryBuilder()
      .delete()
      .where('id = :postId', { postId })
      .execute();
  }
}
