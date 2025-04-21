import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from "./storage";
import authReducer from "./authSlice"
import postReducer from "./postSlice"
import chatReducer from "./chatSlice"
import socketReducer from "./socketSlice"
import rtnReducer from "./rtnSlice"

// Configure persist for auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'] // Only persist the user property
};

// Configure persist for notification slice
const notificationPersistConfig = {
  key: 'realTimeNotification',
  storage,
  whitelist: ['likeNotification'] // Persist notifications
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedNotificationReducer = persistReducer(notificationPersistConfig, rtnReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        post: postReducer,
        chat: chatReducer,
        socketio: socketReducer,
        realTimeNotification: persistedNotificationReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Allow non-serializable values in Redux
        }),
});

export const persistor = persistStore(store);
export default store;
