import { configureStore } from '@reduxjs/toolkit';
import mediatorReducer from './Slice/MediatorSlice/mediatorSlice';
import mediatorDisputesReducer from './Slice/MediatorSlice/mediatorDisputeSlice';

const store = configureStore({
  reducer: {
    mediator: mediatorReducer,
    mediatorDisputes: mediatorDisputesReducer,
    // add other reducers here
  },
});

export { store };
