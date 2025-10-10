import { createSlice } from '@reduxjs/toolkit';

// Default user profile template
const defaultUserState = {
  id: null,
  name: '',
  email: '',
  ageGroup: '',    // 'child', 'teen', 'adult', 'senior'
  gender: '',
  pronouns: '',
  avatar: '',
  theme: '',       // "light", "dark" or preferred color/set
  adhdSubtype: '',
};

const initialState = {
  isAuthenticated: false,
  user: { ...defaultUserState },
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = { ...defaultUserState };
      state.token = null;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateSignUpField: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    resetUser: (state) => {
      // For testing/demo: clears all to fresh user state
      return initialState;
    },
  },
});

// Export ALL actions including the signup field updater!
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  updateSignUpField,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
