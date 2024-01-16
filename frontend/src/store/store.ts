import {configureStore} from '@reduxjs/toolkit'

import AuthReducer from './slices/auth'
import FeedReducer from './slices/feed'
import PostReducer from './slices/post'

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        feed: FeedReducer,
        post: PostReducer
    }
})

// @ts-ignore
window.store = store

export default store
