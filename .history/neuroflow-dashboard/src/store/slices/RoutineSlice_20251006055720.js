import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  routines: [], // Array of { task, time, completed }
};

const routineSlice = createSlice({
  name: 'routine',
  initialState,
  reducers: {
    addRoutine: (state, action) => {
      state.routines.push(action.payload);
    },
    toggleRoutineCompletion: (state, action) => {
      const index = action.payload;
      if(state.routines[index]) {
        state.routines[index].completed = !state.routines[index].completed;
      }
    },
    deleteRoutine: (state, action) => {
      state.routines.splice(action.payload, 1);
    },
    clearRoutines: (state) => {
      state.routines = [];
    },
    setRoutines: (state, action) => {
      state.routines = action.payload;
    },
  },
});

export const {
  addRoutine,
  toggleRoutineCompletion,
  deleteRoutine,
  clearRoutines,
  setRoutines,
} = routineSlice.actions;

export default routineSlice.reducer;
