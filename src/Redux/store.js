import { configureStore } from '@reduxjs/toolkit';
import mediatorReducer from './Slice/MediatorSlice/mediatorSlice';

const store = configureStore({
  reducer: {
    mediator: mediatorReducer,
    // add other reducers here
  },
});

export { store };
