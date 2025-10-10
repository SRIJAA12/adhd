import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isVisible: true,
  isSpeaking: false,
  currentMessage: '',
  messageQueue: [],
  avatarMood: 'happy', // happy, encouraging, concerned, celebrating
  lastInteraction: null,
  settings: {
    voiceEnabled: true,
    voiceRate: 1.0,
    voicePitch: 1.0,
    volume: 0.8,
    autoReminders: true,
    reminderInterval: 30, // minutes
  },
  notifications: {
    timerReminders: true,
    taskReminders: true,
    encouragement: true,
    breaks: true,
  },
  conversationHistory: [],
};

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    setAvatarVisibility(state, action) {
      state.isVisible = action.payload;
    },
    setAvatarSpeaking(state, action) {
      state.isSpeaking = action.payload;
    },
    setCurrentMessage(state, action) {
      state.currentMessage = action.payload;
      state.lastInteraction = Date.now();
    },
    addMessageToQueue(state, action) {
      state.messageQueue.push({
        id: Date.now(),
        text: action.payload.text,
        priority: action.payload.priority || 'normal',
        type: action.payload.type || 'info',
        timestamp: Date.now(),
      });
    },
    removeMessageFromQueue(state) {
      state.messageQueue.shift();
    },
    clearMessageQueue(state) {
      state.messageQueue = [];
    },
    setAvatarMood(state, action) {
      state.avatarMood = action.payload;
    },
    updateAvatarSettings(state, action) {
      state.settings = { ...state.settings, ...action.payload };
    },
    updateNotificationSettings(state, action) {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    addToConversationHistory(state, action) {
      state.conversationHistory.push({
        message: action.payload.message,
        type: action.payload.type,
        timestamp: Date.now(),
      });
      // Keep only last 50 messages
      if (state.conversationHistory.length > 50) {
        state.conversationHistory = state.conversationHistory.slice(-50);
      }
    },
    clearConversationHistory(state) {
      state.conversationHistory = [];
    },
  },
});

export const {
  setAvatarVisibility,
  setAvatarSpeaking,
  setCurrentMessage,
  addMessageToQueue,
  removeMessageFromQueue,
  clearMessageQueue,
  setAvatarMood,
  updateAvatarSettings,
  updateNotificationSettings,
  addToConversationHistory,
  clearConversationHistory,
} = avatarSlice.actions;

export default avatarSlice.reducer;
