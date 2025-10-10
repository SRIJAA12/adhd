import { createSlice } from '@reduxjs/toolkit';

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
    resetTimer(state) {
      state.intervalCount = 0;
      state.timerActive = false;
      state.isBreak = false;
    }
  },
});

export const {
  setUrgency,
  setTimerActive,
  setFocusMode,
  setSoundPlaying,
  setWorkDuration,
  setBreakDuration,
  setIsBreak,
  setIntervalCount,
  resetTimer
} = appSlice.actions;

export default appSlice.reducer;
