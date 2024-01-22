import {configureStore} from '@reduxjs/toolkit'

import AuthReducer from './slices/auth'
import FeedReducer from './slices/feed'
import PostReducer from './slices/post'
import NotificationsReducer from './slices/notifications'

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        feed: FeedReducer,
        post: PostReducer,
        notifications: NotificationsReducer
    }
})

// @ts-ignore
window.store = store

export default store
