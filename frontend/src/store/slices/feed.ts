import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TFeedResponse, IFeedState } from "../../types/store/feed";
import { axiosInstance } from "../../lib/axios";
import { AxiosError } from "axios";

const initialState: IFeedState = {
    postList: null,
    fetching: 'succeeded',
    error: ''
}

const feedSlice = createSlice({
    name: 'feed',
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
            // fetch posts
            .addCase(fetchPostsThunk.pending, (state) => {
                state.error = ''
                state.fetching = 'pending'
            })
            .addCase(fetchPostsThunk.fulfilled, (state, action) => {
                if (state.fetching === 'pending') {
                    const posts = action.payload
                    state.postList = posts
                    state.fetching = 'succeeded'
                }
            })
            .addCase(fetchPostsThunk.rejected, (state, action) => {
                state.fetching = 'succeeded'
                state.postList = null
            })
    }
})

export default feedSlice.reducer

export const fetchPostsThunk = createAsyncThunk<
    TFeedResponse,
    void,
    { rejectValue: string }
>(
    'feed/posts',
    async (payload, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`posts`)
            return response.data as TFeedResponse
        } catch (e) {
            // const error = e as AxiosError || Error
            return thunkAPI.rejectWithValue('Fetching feed error')
        }
    }
)