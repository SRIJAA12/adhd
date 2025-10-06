import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalPoints: 140,
  currentStreak: 3,
  longestStreak: 7,
  level: 5,
  lastActivityDate: new Date().toISOString(),
  badges: ['first-task', 'week-warrior'],
  dailyGoal: 3,
  tasksCompletedToday: 1,
  recentRewards: [],
};

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    addPoints(state, action) {
      state.totalPoints += action.payload;
      const newLevel = Math.floor(state.totalPoints / 100) + 1;
      if (newLevel > state.level) {
        state.level = newLevel;
      }
    },
    incrementStreak(state) {
      state.currentStreak += 1;
      if (state.currentStreak > state.longestStreak) {
        state.longestStreak = state.currentStreak;
      }
      state.lastActivityDate = new Date().toISOString();
    },
    resetStreak(state) {
      state.currentStreak = 0;
    },
    completeTask(state) {
      state.tasksCompletedToday += 1;
      state.totalPoints += 10;
      state.recentRewards.push({
        id: Date.now(),
        type: 'task_complete',
        points: 10,
        timestamp: new Date().toISOString(),
      });
    },
    unlockBadge(state, action) {
      if (!state.badges.includes(action.payload)) {
        state.badges.push(action.payload);
      }
    },
    resetDailyProgress(state) {
      state.tasksCompletedToday = 0;
    },
    addReward(state, action) {
      state.recentRewards.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    clearRecentRewards(state) {
      state.recentRewards = [];
    },
  },
});

export const {
  addPoints,
  incrementStreak,
  resetStreak,
  completeTask,
  unlockBadge,
  resetDailyProgress,
  addReward,
  clearRecentRewards,
} = gamificationSlice.actions;

export default gamificationSlice.reducer;
