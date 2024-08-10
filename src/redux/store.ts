import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import sendUserInfoMiddleware from './middleware/sendUserInfoMiddleware';

import userReducer from './userSlice';
import communicationReducer from './appCommunicationSlice';

const persistConfig = {
    key: 'visualRoot',
    storage: storageSession,
    // 黑名单
    blacklist: ['appCommunication'],
    // 白名单
    whitelist: ['user'],
};

const rootReducer = combineReducers({
    user: userReducer,
    appCommunication: communicationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ serializableCheck: false }).concat(
            sendUserInfoMiddleware as Middleware,
        ),
});

const persistor = persistStore(store);

export { store, persistor };

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
