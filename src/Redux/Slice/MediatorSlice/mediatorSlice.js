// src/Redux/Slice/MediatorSlice/mediatorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// POST: Add new mediator
export const addMediator = createAsyncThunk(
  'mediator/addMediator',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/onboarding_mediators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to add mediator');
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Unknown error');
    }
  }
);

// GET: Fetch all mediators
export const fetchAllMediators = createAsyncThunk(
  'mediator/fetchAllMediators',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/fetch_all_mediators`);
      if (!res.ok) throw new Error('Failed to fetch mediators');
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Unknown error');
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMediator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMediator.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload); // Add to top
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
