import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './slices/userSlice';
import gamificationReducer from './slices/gamificationSlice';
import memoryReducer from './slices/memorySlice';
import routineReducer from './slices/routineSlice';
import appReducer from './slices/appSlice';
import avatarReducer from './slices/avatarSlice';

const rootReducer = combineReducers({
  user: userReducer,
  gamification: gamificationReducer,
  memory: memoryReducer,
  routine: routineReducer,
  app: appReducer,
  avatar: avatarReducer,
});

const persistConfig = {
  key: 'neuroflow-root',
  storage,
  whitelist: ['user', 'gamification', 'memory', 'routine', 'app', 'avatar'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
