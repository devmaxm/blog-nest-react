import { IComment, IPostDetail } from "../general/post"

export interface IPostState {
    post: IPostDetail | null
    fetching: 'pending' | 'succeeded',
    error: string
}

export type TPostResponse = IPostDetail

export type TCreateCommentResponse = IComment