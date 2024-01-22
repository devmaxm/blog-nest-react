import { IComment, IPost } from "./post"

export interface INotification {
    id: number
    message: string
    isChecked: boolean
    createdAt: string
    post: Omit<IPost, 'author'> | null
    comment: Omit<IComment, "likesCount" | "isLiked" | "parent" | "author" | "children"> | null
}