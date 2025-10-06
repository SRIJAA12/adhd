import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalPoints: 0,
  currentStreak: 0,
  longestStreak: 0,
  badges: [
    { id: 1, name: 'First Task', icon: '🎯', unlocked: false, description: 'Complete your first task' },
    { id: 2, name: 'Week Warrior', icon: '⚔️', unlocked: false, description: '7 day streak' },
    { id: 3, name: 'Focus Master', icon: '🧘', unlocked: false, description: '30 minutes focused work' },
    { id: 4, name: 'Early Bird', icon: '🌅', unlocked: false, description: 'Complete task before 9 AM' },
    { id: 5, name: 'Night Owl', icon: '🦉', unlocked: false, description: 'Complete task after 9 PM' },
    { id: 6, name: 'Task Ninja', icon: '🥷', unlocked: false, description: 'Complete 10 tasks in a day' },
  ],
  recentRewards: [],
  streakDays: [],
  lastActiveDate: null,
};

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    addPoints: (state, action) => {
      state.totalPoints += action.payload.points;
      state.recentRewards.unshift({
        id: Date.now(),
        points: action.payload.points,
        message: action.payload.message,
        timestamp: new Date().toISOString(),
      });
      // Keep only last 5 rewards
      if (state.recentRewards.length > 5) {
        state.recentRewards = state.recentRewards.slice(0, 5);
      }
    },
    updateStreak: (state, action) => {
      state.currentStreak = action.payload;
      if (action.payload > state.longestStreak) {
        state.longestStreak = action.payload;
      }
    },
    unlockBadge: (state, action) => {
      const badge = state.badges.find((b) => b.id === action.payload);
      if (badge && !badge.unlocked) {
        badge.unlocked = true;
        state.totalPoints += 100; // Bonus points for unlocking badge
      }
    },
    addStreakDay: (state, action) => {
      state.streakDays.push({
        date: action.payload.date,
        completed: action.payload.completed,
      });
    },
    clearRecentRewards: (state) => {
      state.recentRewards = [];
    },
    resetGamification: () => {
      return initialState;
    },
  },
});

export const {
  addPoints,
  updateStreak,
  unlockBadge,
  addStreakDay,
  clearRecentRewards,
  resetGamification,
} = gamificationSlice.actions;

export default gamificationSlice.reducer;
