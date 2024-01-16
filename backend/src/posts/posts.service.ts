import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsEntity } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { CommentsService } from '../comments/comments.service';
import { ISanitizedUser } from '../users/interfaces/user.interface';
import { IPostFindOptions } from './interfaces/post-find-options.interface';
import { FindPostDto } from './dtos/find-post.dto';
import { IPaginatedPosts } from './interfaces/post.interface';

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
    const author = await this.usersService.getOneSanitized({ id: authorId });
    if (!author) {
      throw new NotFoundException('User not found.');
    }
    const newPost = new PostsEntity();
    Object.assign(newPost, data);
    newPost.author = author;
    return await this.postsRepository.save(newPost);
  }

  async getOne(where: IPostFindOptions): Promise<PostsEntity> {
    const post = await this.postsRepository.findOne({
      where,
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    return post;
  }
  async getOneDetails(
    where: IPostFindOptions,
    currentUser: ISanitizedUser,
  ): Promise<PostsEntity | null> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .where('post.id = :postId', { postId: where.id })
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .getOne();
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    const comments = await this.commentsService.getAll(post.id, currentUser.id);
    post.comments = comments;
    return post;
  }

  async getAll(findParams?: FindPostDto): Promise<IPaginatedPosts> {
    const page = Number(findParams.page) || 1;
    const limit = Number(findParams.limit) || 10;
    const offset = (page - 1) * limit;

    const [data, total] = await this.postsRepository.findAndCount({
      relations: ['author'],
      take: limit,
      skip: offset,
    });

    return {
      data,
      total,
      page,
      perPage: data.length,
    };
  }

  async update(
    where: IPostFindOptions,
    data: UpdatePostDto,
  ): Promise<PostsEntity> {
    const post = await this.postsRepository.findOne({ where });
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
