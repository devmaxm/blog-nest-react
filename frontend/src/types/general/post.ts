import { ICleanUser } from "./auth";

export interface IComment {
    id: number;
    body: string;
    createdAt: string;
    likesCount: number;
    isLiked: boolean;
    post: IPost
    parent: ICommentParent | null 
    author: ICleanUser;
    children: IComment[]
}
interface ICommentParent {
    id: number
}

export interface IPost {
    id: number;
    title: string;
    body: string;
    createdAt: string;
    author: ICleanUser
}

export interface IPostDetail extends IPost {
    comments: IComment[];
    isLiked: boolean
    likesCount: number;
}