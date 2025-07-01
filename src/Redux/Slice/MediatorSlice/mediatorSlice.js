import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 📦 Thunk to fetch all mediators from the backend API
export const fetchAllMediators = createAsyncThunk(
  'mediator/fetchAll',
  async (_, thunkAPI) => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const ENDPOINT = import.meta.env.VITE_FETCH_ALL_MEDIATORS;
      const response = await fetch(`${BASE_URL}${ENDPOINT}`);

      if (!response.ok) {
        throw new Error('Failed to fetch mediators');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('fetchAllMediators error:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🔁 Initial state
const initialState = {
  list: [],
  loading: false,
  error: null,
};

// 🧠 Create slice
const mediatorSlice = createSlice({
  name: 'mediator',
  initialState,
  reducers: {
    // Add a new mediator to the top of the list
    addMediator: (state, action) => {
      const newMediator = {
        ...action.payload,
        timestamp: new Date().toISOString(), // use backend timestamp if available
      };
      state.list.unshift(newMediator); // 👈 Add to top
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMediators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMediators.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllMediators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

// 🧩 Export actions and reducer
export const { addMediator } = mediatorSlice.actions;
export default mediatorSlice.reducer;
