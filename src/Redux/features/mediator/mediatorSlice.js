import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
};

const mediatorSlice = createSlice({
  name: 'mediator',
  initialState,
  reducers: {
    addMediator: (state, action) => {
      const newMediator = {
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      state.list.push(newMediator);
    },
  },
});

export const { addMediator } = mediatorSlice.actions;
export default mediatorSlice.reducer;
