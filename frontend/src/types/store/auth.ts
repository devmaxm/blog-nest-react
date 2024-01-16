import {IUser} from "../general/auth";

export interface IAuthState {
    isAuth: boolean
    accessToken: string | null,
    refreshToken: string | null,
    user: IUser | null,
    fetching: 'pending' | 'succeeded',
    error: string
}

export interface ITokens {
    accessToken: string;
    refreshToken: string;
}
export interface TAuthResponse {
    tokens: ITokens
    user: IUser
}