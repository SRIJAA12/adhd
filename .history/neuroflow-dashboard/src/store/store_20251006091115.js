import { configureStore, combineReducers, createSlice } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import routineReducer from './slices/RoutineSlice.js';
import userReducer from './slices/userSlice';
import gamificationReducer from './slices/gamificationSlice';
import memoryReducer from './slices/memorySlice';

// Define your app slice
const initialState = {
  urgency: 0.25,
  timerActive: false,
  focusMode: false,
  soundPlaying: false,

  urgencyStep: 0.02,
  intervalMs: 1000,
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
  isBreak: false,
  intervalCount: 0,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUrgency(state, action) {
      state.urgency = action.payload;
    },
    setTimerActive(state, action) {
      state.timerActive = action.payload;
    },
    setFocusMode(state, action) {
      state.focusMode = action.payload;
    },
    setSoundPlaying(state, action) {
      state.soundPlaying = action.payload;
    },
    setUrgencyStep(state, action) {
      state.urgencyStep = action.payload;
    },
    setIntervalMs(state, action) {
      state.intervalMs = action.payload;
    },
    setWorkDuration(state, action) {
      state.workDuration = action.payload;
    },
    setBreakDuration(state, action) {
      state.breakDuration = action.payload;
    },
    setIsBreak(state, action) {
      state.isBreak = action.payload;
    },
    setIntervalCount(state, action) {
      state.intervalCount = action.payload;
    },
  },
});

export const {
  setUrgency,
  setTimerActive,
  setFocusMode,
  setSoundPlaying,
  setUrgencyStep,
  setIntervalMs,
  setWorkDuration,
  setBreakDuration,
  setIsBreak,
  setIntervalCount,
} = appSlice.actions;

// Combine your reducers including app slice reducer
const rootReducer = combineReducers({
  user: userReducer,
  gamification: gamificationReducer,
  memory: memoryReducer,
  routine: routineReducer,
  app: appSlice.reducer,
});

// Persist configuration including app slice
const persistConfig = {
  key: 'neuroflow-root',
  storage,
  whitelist: ['user', 'gamification', 'memory', 'routine', 'app'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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
