import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://mydoshbox-be.onrender.com/mediators';

// Add Mediator Thunk
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
        console.error('Add Mediator Error:', errorText);
        throw new Error(errorText || 'Failed to add mediator');
      }

      const data = await response.json();
      console.log('Add Mediator Success:', data);
      return data;
    } catch (error) {
      console.error('Add Mediator Catch Error:', error.message);
      return rejectWithValue(error.message || 'Unknown error');
    }
  }
);

// Fetch All Mediators Thunk
export const fetchAllMediators = createAsyncThunk(
  'mediator/fetchAllMediators',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/fetch-all-mediators`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch Mediators Error:', errorText);
        throw new Error(errorText || 'Failed to fetch mediators');
      }

      const data = await response.json();
      console.log('Fetched Mediators Response:', data);

      // Adjust to fit your backend's response structure
      if (Array.isArray(data)) {
        return data;
      } else if (Array.isArray(data.fetchAllMediators)) {
        return data.fetchAllMediators;
      } else {
        console.warn('Unexpected mediator response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Fetch Mediators Catch Error:', error.message);
      return rejectWithValue(error.message || 'Unknown error');
    }
  }
);

// Mediator Slice
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
      // Add Mediator
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
        state.error = action.payload || 'Failed to add mediator';
      })

      // Fetch All Mediators
      .addCase(fetchAllMediators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMediators.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload)
          ? action.payload.reverse()
          : [];
      })
      .addCase(fetchAllMediators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch mediators';
      });
  },
});

export default mediatorSlice.reducer;
