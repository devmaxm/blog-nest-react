import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosInstance, getError} from "lib/axios";
import {AxiosError} from "axios";
import {IAuthState, TAuthResponse} from "types/store/auth";


const initialState: IAuthState = {
    isAuth: !!localStorage.getItem('accessToken'),
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    fetching: 'succeeded',
    error: ''
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        toggleFetching(state) {
            if (state.fetching === 'succeeded') {
                state.fetching = 'pending'
            }
        },
        logout(state) {
            state.fetching = 'pending'
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')

            state.isAuth = false
            state.accessToken = null
            state.refreshToken = null
            state.user = null
            state.fetching = 'succeeded'

        },
        refreshTokens(state, action) {
            const {accessToken, refreshToken, user} = action.payload
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            localStorage.setItem('user', JSON.stringify(user))

            state.isAuth = true
            state.accessToken = accessToken
            state.refreshToken = refreshToken
            state.user = user
            state.fetching = 'succeeded'
        },
        setError(state, action) {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder
            // login
            .addCase(loginThunk.pending, (state) => {
                state.error = ''
                state.fetching = 'pending'
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                const {tokens: {accessToken, refreshToken}, user} = action.payload
                localStorage.setItem('accessToken', accessToken)
                localStorage.setItem('refreshToken', refreshToken)
                localStorage.setItem('user', JSON.stringify(user))

                state.isAuth = true
                state.accessToken = accessToken
                state.refreshToken = refreshToken
                state.user = user
                state.fetching = 'succeeded'

            })
            .addCase(loginThunk.rejected, (state, action) => {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')

                state.isAuth = false
                state.error = action.payload ? action.payload : 'Помилка'
                state.accessToken = null
                state.refreshToken = null
                state.user = null
                state.fetching = 'succeeded'

            })
            // refresh tokens
            .addCase(refreshTokensThunk.fulfilled, (state, action) => {
                const {tokens: {accessToken, refreshToken}, user} = action.payload
                localStorage.setItem('accessToken', accessToken)
                localStorage.setItem('refreshToken', refreshToken)
                localStorage.setItem('user', JSON.stringify(user))

                state.isAuth = true
                state.accessToken = accessToken
                state.refreshToken = refreshToken
                state.user = user
            })
            .addCase(refreshTokensThunk.rejected, (state) => {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')

                state.isAuth = false
                state.accessToken = null
                state.refreshToken = null
                state.user = null
            })
            // register
            .addCase(registerThunk.pending, (state) => {
                state.error = ''
                state.fetching = 'pending'
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                if (state.fetching === 'pending') {
                    const {tokens: {accessToken, refreshToken}, user} = action.payload
                    localStorage.setItem('accessToken', accessToken)
                    localStorage.setItem('refreshToken', refreshToken)
                    localStorage.setItem('user', JSON.stringify(user))

                    state.isAuth = true
                    state.accessToken = accessToken
                    state.refreshToken = refreshToken
                    state.user = user
                    state.fetching = 'succeeded'
                }
            })
            .addCase(registerThunk.rejected, (state, action) => {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')

                state.isAuth = false
                state.error = action.payload ? action.payload : 'Error'
                state.accessToken = null
                state.refreshToken = null
                state.user = null
                state.fetching = 'succeeded'
            })
            // checkAuth
            .addCase(checkAuth.rejected, (state) => {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')

                state.isAuth = false
                state.accessToken = null
                state.refreshToken = null
                state.user = null
            })
    }
})

export default authSlice.reducer

// selectors

// actions
export const {logout, setError, refreshTokens} = authSlice.actions

export const loginThunk = createAsyncThunk<TAuthResponse,
    { email: string, password: string },
    { rejectValue: string }>(
    'auth/login',
    async (payload, thunkAPI) => {
        try {
            const response = await axiosInstance.post(`auth/login`, {
                email: payload.email,
                password: payload.password
            })
            return response.data as TAuthResponse
        } catch (e) {
            const error = e as AxiosError || Error
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const registerThunk = createAsyncThunk<TAuthResponse,
    { username: string, password: string, password2: string },
    { rejectValue: string }>(
    'auth/register',
    async (payload, thunkAPI) => {
        try {
            const response = await axiosInstance.post(`auth/register`, {
                username: payload.username,
                password: payload.password,
                password2: payload.password2
            })
            return response.data as TAuthResponse
        } catch (e) {
            const error = e as Error | AxiosError
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const refreshTokensThunk = createAsyncThunk<TAuthResponse>(
    'auth/refreshTokens',
    async () => {
        const response = await axiosInstance.post('auth/refresh-tokens', {}, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('refreshToken')}`
            }
        })
        return response.data
    }
)

export const checkAuth = createAsyncThunk<TAuthResponse>(
    'auth/checkAuth',
    async () => {
        const response = await axiosInstance.get('auth/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        return response.data as TAuthResponse
    }
)
