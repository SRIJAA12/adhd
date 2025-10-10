import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import routineReducer from './slices/routineSlice';
import userReducer from './slices/userSlice';
import gamificationReducer from './slices/gamificationSlice';
import memoryReducer from './slices/memorySlice';

// Combine all reducers, including routine
const rootReducer = combineReducers({
  user: userReducer,
  gamification: gamificationReducer,
  memory: memoryReducer,
  routine: routineReducer,
});

// Persist configuration, including routine
const persistConfig = {
  key: 'neuroflow-root',
  storage,
  whitelist: ['user', 'gamification', 'memory', 'routine'],
};

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
