import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAllMediators = createAsyncThunk(
  'mediator/fetchAll',
  async (_, thunkAPI) => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const ENDPOINT = import.meta.env.VITE_FETCH_ALL_MEDIATORS;
      const response = await fetch(`${BASE_URL}${ENDPOINT}`);
      if (!response.ok) throw new Error('Server error');
      return await response.json();
    } catch (err) {
      console.error('Fetch error:', err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const mediatorSlice = createSlice({
  name: 'mediator',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMediator: (state, action) => {
      const newMediator = {
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      state.list.push(newMediator);
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

export const { addMediator } = mediatorSlice.actions;
export default mediatorSlice.reducer;
