import { IPaginatedResponse } from '../../data-types/interfaces/paginated-response.interface';
import { PostsEntity } from '../entities/posts.entity';

export class IPost extends PostsEntity {
  isLiked: boolean;
}

export class IPaginatedPosts extends IPaginatedResponse<PostsEntity> {}
