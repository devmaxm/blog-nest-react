import { INotification } from "../general/notification"

export interface INotificationsState {
    notifications: INotification[] | null
    fetching: 'pending' | 'succeeded',
    error: string
}

export type TNotificationsResponse = INotification[]