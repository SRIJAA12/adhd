import { createSlice } from '@reduxjs/toolkit';

const defaultUserState = {
  id: null,
  name: '',
  email: '',
  ageGroup: '',    // 'child', 'teen', 'adult', 'senior'
  gender: '',
  pronouns: '',
  avatar: '',
  theme: '',       // Future: store "light" / "dark" / color preference
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
      // Update user fields during signup steps
      state.user = { ...state.user, ...action.payload };
    },
  },
});

// Export all actions including updateSignUpField
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  updateSignUpField,
} = userSlice.actions;

export default userSlice.reducer;
