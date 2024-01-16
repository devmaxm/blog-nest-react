export interface IUser {
    id: number;
    email: string;
    username: string;
    createdAt: string;
}

export interface ICleanUser extends Omit<IUser, 'email'> {}