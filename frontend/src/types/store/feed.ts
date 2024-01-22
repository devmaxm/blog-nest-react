import { PaginatedResponse } from "../general/paginated-response";
import { IPost } from "../general/post";

export interface IFeedState {
    postList: PaginatedResponse<IPost> | null
    fetching: 'pending' | 'succeeded',
    error: string
}

export type TFeedResponse = PaginatedResponse<IPost>