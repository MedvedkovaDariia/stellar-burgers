import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';

import type { TOrder } from '../../utils/types'; //, type TOrdersData

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientsIds: string[], { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientsIds);
      return data.order; // Обычно сервер возвращает объект с номером заказа
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);
      return data.orders[0];
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

type TOrderState = {
  orderNumber: number | null;
  orderData: TOrder | null;
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderNumber: null,
  orderData: null,
  currentOrder: null,
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderNumber = null;
      state.orderData = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderNumber = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderNumber = action.payload.number;
        state.orderData = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error as string;
        state.orderNumber = null;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload; // Сохраняем найденный заказ
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrder, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
