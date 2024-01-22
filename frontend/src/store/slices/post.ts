import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IPostState, TCreateCommentResponse, TPostResponse } from "../../types/store/post";
import { axiosInstance } from "../../lib/axios";
import { IComment } from "../../types/general/post";

const initialState: IPostState = {
    post: null,
    fetching: 'succeeded',
    error: ''
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        toggleFetching(state) {
            if (state.fetching === 'succeeded') {
                state.fetching = 'pending'
            }
        },
        setError(state, action) {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder
            // Post create
            .addCase(createPostThunk.pending, (state) => {
                state.error = ''
                state.fetching = 'pending'
            })
            .addCase(createPostThunk.fulfilled, (state, action) => {
                if (state.fetching === 'pending') {
                    const post = action.payload
                    state.post = post
                    state.fetching = 'succeeded'
                }
            })
            .addCase(createPostThunk.rejected, (state, action) => {
                state.fetching = 'succeeded'
                state.post = null
            })
            // Post Like
            .addCase(likePostThunk.fulfilled, (state) => {
                const { post } = state
                if (post) {
                    post.likesCount += 1
                    post.isLiked = true
                    state.fetching = 'succeeded'
                }

            })
            // Post remove like
            .addCase(removePostLikeThunk.fulfilled, (state) => {
                const { post } = state
                if (post) {
                    post.likesCount -= 1
                    post.isLiked = false
                    state.fetching = 'succeeded'
                }
            })
            // Comment Like
            .addCase(likeCommentThunk.fulfilled, (state, action) => {
                const { commentId } = action.payload
                if (state.post) {
                    const comment = findCommentById(commentId, state.post.comments)
                    if (comment) {
                        comment.isLiked = true
                        comment.likesCount += 1
                    }
                    
                }
            })
            // Remove Comment Like
            .addCase(removeCommentLikeThunk.fulfilled, (state, action) => {
                const { commentId } = action.payload
                if (state.post) {
                    const comment = findCommentById(commentId, state.post.comments)
                    if (comment) {
                        comment.isLiked = false
                        comment.likesCount -= 1
                    }
                    
                }
            })
            // Create Comment
            .addCase(createCommentThunk.fulfilled, (state, action) => {
                const comment = action.payload
                if (state.post) {
                    if (comment.parent) {
                        const parent = findCommentById(comment.parent.id, state.post.comments)
                        if (parent) {
                            parent.children.push(comment)
                        }
                    } else { 
                        state.post.comments.push(comment)
                    }
                }
            })

    }
})

export default postSlice.reducer

function findCommentById(commentId: number, comments: IComment[]): IComment | null {
    for (const comment of comments) {
        if (comment.id === commentId) {
            return comment;
        }

        const foundInChildren = findCommentById(commentId, comment.children);
        if (foundInChildren) {
            return foundInChildren;
        }
    }

    return null;
}


export const createPostThunk = createAsyncThunk<
    TPostResponse,
    { title: string, body: string, },
    { rejectValue: string }
>(
    'posts/create',
    async (payload, thunkAPI) => {
        try {
            const data = { ...payload }
            const response = await axiosInstance.post(`posts`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })
            return response.data as TPostResponse
        } catch (e) {
            // const error = e as AxiosError || Error
            return thunkAPI.rejectWithValue('Post create error')
        }
    }
)

export const fetchPostThunk = createAsyncThunk<
    TPostResponse,
    { id: string | number },
    { rejectValue: string }
>(
    'posts/create',
    async (payload, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`posts/${payload.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })
            return response.data as TPostResponse
        } catch (e) {
            // const error = e as AxiosError || Error
            return thunkAPI.rejectWithValue('Post fetching error')
        }
    }
)

export const createCommentThunk = createAsyncThunk<
    TCreateCommentResponse,
    { body: string, parentId?: number, postId: string | number },
    { rejectValue: string }
>(
    'posts/comment/create',
    async (payload, thunkAPI) => {
        try {
            const data = {
                body: payload.body,
                parentId: payload.parentId
            }
            const response = await axiosInstance.post(`posts/${payload.postId}/comments`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })
            return response.data as TCreateCommentResponse
        } catch (e) {
            // const error = e as AxiosError || Error
            return thunkAPI.rejectWithValue('Post fetching error')
        }
    }
)

export const likePostThunk = createAsyncThunk<
    { postId: number },
    { postId: string | number },
    { rejectValue: string }
>(
    'posts/like',
    async (payload, thunkAPI) => {
        const { postId } = payload
        try {
            await axiosInstance.post(`posts/${postId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            return { postId: Number(postId) }
        } catch (e) {
            // const error = e as AxiosError || Error
            return thunkAPI.rejectWithValue('Post like error')
        }
    }
)

export const removePostLikeThunk = createAsyncThunk<
    { postId: number },
    { postId: string | number },
    { rejectValue: string }
>(
    'posts/like/remove',
    async (payload, thunkAPI) => {
        const { postId } = payload
        try {
            await axiosInstance.delete(`posts/${postId}/like`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            return { postId: Number(postId) }
        } catch (e) {
            // const error = e as AxiosError || Error
            return thunkAPI.rejectWithValue('Post remove like error')
        }
    }
)

export const likeCommentThunk = createAsyncThunk<
    { commentId: number },
    { commentId: string | number, postId: number | string },
    { rejectValue: string }
>(
    'posts/comment/like',
    async (payload, thunkAPI) => {
        const { commentId, postId } = payload
        try {
            await axiosInstance.post(`posts/${postId}/comments/${commentId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            return { commentId: Number(commentId) }
        } catch (e) {
            // const error = e as AxiosError || Error
            return thunkAPI.rejectWithValue('Comment like error')
        }
    }
)

export const removeCommentLikeThunk = createAsyncThunk<
    { commentId: number },
    { commentId: string | number, postId: string | number },
    { rejectValue: string }
>(
    'posts/comment/like/remove',
    async (payload, thunkAPI) => {
        const { commentId, postId } = payload
        try {
            await axiosInstance.delete(`posts/${postId}/comments/${commentId}/like`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            return { commentId: Number(commentId) }
        } catch (e) {
            // const error = e as AxiosError || Error
            return thunkAPI.rejectWithValue('Remove comment like error')
        }
    }
)
