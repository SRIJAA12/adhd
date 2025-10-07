import { createSlice } from '@reduxjs/toolkit';

const defaultUserState = {
  id: null,
  name: '',
  username: '',
  email: '',
  ageGroup: 'adult',
  gender: '',
  pronouns: '',
  avatar: '',
  theme: 'light',
  adhdSubtype: '',
  points: 0,
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
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = { ...defaultUserState };
      state.token = null;
      state.error = null;
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    updatePoints(state, action) {
      state.user.points = action.payload;
    },
    addPoints(state, action) {
      state.user.points = (state.user.points || 0) + action.payload;
    },
    updateSignUpField(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    resetUser(state) {
      state.isAuthenticated = false;
      state.user = { ...defaultUserState };
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  updatePoints,
  addPoints,
  updateSignUpField,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
