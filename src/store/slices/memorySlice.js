import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clipboardItems: [],
  contextHistory: [],
  currentContext: null,
  memoryGameScores: [],
};

const memorySlice = createSlice({
  name: 'memory',
  initialState,
  reducers: {
    addClipboardItem: (state, action) => {
      state.clipboardItems.unshift({
        id: Date.now(),
        text: action.payload.text,
        timestamp: new Date().toISOString(),
        category: action.payload.category || 'general',
      });
      // Keep only last 20 items
      if (state.clipboardItems.length > 20) {
        state.clipboardItems = state.clipboardItems.slice(0, 20);
      }
    },
    removeClipboardItem: (state, action) => {
      state.clipboardItems = state.clipboardItems.filter((item) => item.id !== action.payload);
    },
    clearClipboard: (state) => {
      state.clipboardItems = [];
    },
    setCurrentContext: (state, action) => {
      state.currentContext = action.payload;
      state.contextHistory.push({
        context: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    addMemoryGameScore: (state, action) => {
      state.memoryGameScores.push({
        score: action.payload.score,
        gameType: action.payload.gameType,
        timestamp: new Date().toISOString(),
      });
    },
  },
});

export const {
  addClipboardItem,
  removeClipboardItem,
  clearClipboard,
  setCurrentContext,
  addMemoryGameScore,
} = memorySlice.actions;

export default memorySlice.reducer;
