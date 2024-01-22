import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { INotificationsState, TNotificationsResponse } from "../../types/store/notifications";

const initialState: INotificationsState = {
    notifications: null,
    error: '',
    fetching: 'succeeded'
}

const notificationsSlice = createSlice({
    name: 'notifications',
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
        // fetch notifications
        .addCase(fetchNotificationsThunk.pending, (state) => {
            state.error = ''
            state.fetching = 'pending'
        })
        .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
            if (state.fetching === 'pending') {
                const notifications = action.payload
                state.notifications = notifications
                state.fetching = 'succeeded'
            }
        })
        .addCase(fetchNotificationsThunk.rejected, (state, action) => {
            state.fetching = 'succeeded'
            state.notifications = null
        })
    }
})

export default notificationsSlice.reducer

export const fetchNotificationsThunk = createAsyncThunk<
    TNotificationsResponse,
    void,
    { rejectValue: string }
>(
    'notifications',
    async (payload, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`notifications`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })
            return response.data as TNotificationsResponse
        } catch (e) {
            // const error = e as AxiosError || Error
            return thunkAPI.rejectWithValue('Notification fetching error')
        }
    }
)