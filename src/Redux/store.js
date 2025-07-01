import { configureStore } from '@reduxjs/toolkit';
import mediatorReducer from './features/mediator/mediatorSlice';

export const store = configureStore({
  reducer: {
    mediator: mediatorReducer,
  },
});
