// mediatorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://mydoshbox-be.onrender.com/mediators';

// Export these thunks!
export const addMediator = createAsyncThunk(
  'mediator/addMediator',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/onboard-mediator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to add mediator');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Unknown error');
    }
  }
);

export const fetchAllMediators = createAsyncThunk(
  'mediator/fetchAllMediators',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/fetch-all-mediators`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch mediators');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Unknown error');
    }
  }
);

const mediatorSlice = createSlice({
  name: 'mediator',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMediator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMediator.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(addMediator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllMediators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMediators.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.reverse();
      })
      .addCase(fetchAllMediators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default mediatorSlice.reducer;
