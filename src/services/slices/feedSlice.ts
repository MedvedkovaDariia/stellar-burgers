import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getFeedsApi, getErrorMessage } from '../../utils/burger-api';

import type { TFeedState } from '../../utils/types';

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;

        if (Array.isArray(action.payload)) {
          state.orders = action.payload;
        } else if (action.payload?.orders) {
          state.error = null;
          state.orders = action.payload.orders;
          state.total = action.payload.total ?? 0;
          state.totalToday = action.payload.totalToday ?? 0;
        }
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default feedSlice.reducer;
