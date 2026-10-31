import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getOrdersApi } from '../../utils/burger-api';

import type { TOrder } from '../../utils/types';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Произошла неизвестная ошибка';
};

export const getProfileOrders = createAsyncThunk(
  'profileOrders/getProfileOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

const profileOrderSlice = createSlice({
  name: 'profileOrder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileOrders.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
        state.orders = [];
      });
  },
});

export default profileOrderSlice.reducer;
