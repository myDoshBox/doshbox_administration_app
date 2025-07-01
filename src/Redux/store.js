import { configureStore } from '@reduxjs/toolkit';
import mediatorReducer from './Slice/MediatorSlice/mediatorSlice';

export const store = configureStore({
  reducer: {
    mediator: mediatorReducer,
  },
});
