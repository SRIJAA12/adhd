import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gamesPlayed: 0,
  gamesWon: 0,
  highScore: 0,
  currentScore: 0,
  difficulty: 'easy',
  clipboardItems: [],
};

const memorySlice = createSlice({
  name: 'memory',
  initialState,
  reducers: {
    startGame(state) {
      state.currentScore = 0;
      state.gamesPlayed += 1;
    },
    updateScore(state, action) {
      state.currentScore = action.payload;
      if (action.payload > state.highScore) {
        state.highScore = action.payload;
      }
    },
    winGame(state) {
      state.gamesWon += 1;
    },
    setDifficulty(state, action) {
      state.difficulty = action.payload;
    },
    addClipboardItem(state, action) {
      state.clipboardItems.push({
        id: Date.now(),
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    removeClipboardItem(state, action) {
      state.clipboardItems = state.clipboardItems.filter(
        item => item.id !== action.payload
      );
    },
    clearClipboard(state) {
      state.clipboardItems = [];
    },
  },
});

export const {
  startGame,
  updateScore,
  winGame,
  setDifficulty,
  addClipboardItem,
  removeClipboardItem,
  clearClipboard,
} = memorySlice.actions;

export default memorySlice.reducer;
