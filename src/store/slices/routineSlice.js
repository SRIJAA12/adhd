import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  routines: [],
  activeRoutine: null,
};

const routineSlice = createSlice({
  name: 'routine',
  initialState,
  reducers: {
    addRoutine: (state, action) => {
      state.routines.push({
        id: Date.now(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      });
    },
    updateRoutine: (state, action) => {
      const index = state.routines.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.routines[index] = { ...state.routines[index], ...action.payload };
      }
    },
    deleteRoutine: (state, action) => {
      state.routines = state.routines.filter(r => r.id !== action.payload);
    },
    setActiveRoutine: (state, action) => {
      state.activeRoutine = action.payload;
    },
  },
});

export const { addRoutine, updateRoutine, deleteRoutine, setActiveRoutine } = routineSlice.actions;
export default routineSlice.reducer;
