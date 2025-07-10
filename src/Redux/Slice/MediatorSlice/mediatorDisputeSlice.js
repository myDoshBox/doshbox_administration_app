import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchMediatorDisputes = createAsyncThunk(
  'mediatorDisputes/fetchMediatorDisputes',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://mydoshbox-be.vercel.app/mediators/fetch-all-mediator-dispute/${email}`
      );

      // Explicitly check for 404 or other specific statuses if needed
      if (response.status === 404) {
        // Mediator not found, treat as 0 disputes and don't throw a "server" error
        return {
          email,
          count: 0,
          message: 'Mediator not found.', // More specific message
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch disputes');
      }

      const data = await response.json();

      const assignedCount = Array.isArray(data?.data?.disputes)
        ? data.data.disputes.length
        : 0;

      return {
        email,
        count: assignedCount,
      };
    } catch (error) {
      // Catch network errors or errors thrown by !response.ok
      return rejectWithValue({
        email,
        count: 0,
        message: error.message || 'Unknown error',
      });
    }
  }
);

const slice = createSlice({
  name: 'mediatorDisputes',
  initialState: {
    disputeCounts: {}, // { [email]: count }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediatorDisputes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMediatorDisputes.fulfilled, (state, action) => {
        const { email, count, message } = action.payload; // Destructure message too
        state.loading = false;
        state.disputeCounts[email] = count;
        // Optionally store specific messages if the action payload includes one
        // if (message) {
        //   // You might want a separate state for specific per-mediator messages
        //   console.warn(`Dispute fetch warning for ${email}: ${message}`);
        // }
      })
      .addCase(fetchMediatorDisputes.rejected, (state, action) => {
        const { email, count, message } = action.payload || {};
        state.loading = false;
        if (email) state.disputeCounts[email] = count || 0;
        state.error = message || 'Error fetching disputes';
      });
  },
});

export default slice.reducer;