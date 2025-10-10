import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import gamificationReducer from './slices/gamificationSlice';
import memoryReducer from './slices/memorySlice';

// Persist configuration
const persistConfig = {
  key: 'neuroflow-root',
  storage,
  whitelist: ['user', 'gamification', 'memory'], // Only persist these reducers
};

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  gamification: gamificationReducer,
  memory: memoryReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
