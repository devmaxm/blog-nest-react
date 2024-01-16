import { IPost } from "../general/post";

export interface IFeedState {
    postList: IPost[] | null
    fetching: 'pending' | 'succeeded',
    error: string
}

export type TFeedResponse = IPost[]