import type { TProfileOrdersState } from '../slices/profileOrderSlice';
import type { RootState } from '../store';
import type {
  TIngredient,
  TOrder,
  TConstructorState,
  TUser,
  TFeedState,
} from '@utils-types';
// --- Селекторы ингредиентов ---
export const getIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.ingredients;
export const getIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isIngredientsLoading;
export const getIngredientsError = (state: RootState): string | null =>
  state.ingredients.ingredientsError;

// --- Селекторы конструктора ---
export const getConstructorItems = (state: RootState): TConstructorState =>
  state.burgerConstructor;

// --- Селекторы пользователя ---
export const getUserName = (state: RootState): string | undefined =>
  state.user.user?.name;
export const getUser = (state: RootState): TUser | null => state.user.user;
export const getUserLoading = (state: RootState): boolean => state.user.isLoading;
export const getUserError = (state: RootState): unknown => state.user.error;
export const getUserAuth = (state: RootState): boolean => state.user.isAuth;

// --- Селекторы заказа (создание) ---
export const getOrderRequest = (state: RootState): boolean => state.order.isLoading;
export const getOrderModalData = (state: RootState): TOrder | null =>
  state.order.orderData;
export const getCurrentOrder = (state: RootState): TOrder | null =>
  state.order.currentOrder;

// --- Селекторы ленты заказов ---
export const getFeed = (state: RootState): TFeedState => state.feed;
export const getFeedOrders = (state: RootState): TOrder[] => state.feed.orders;
export const getFeedTotal = (state: RootState): number => state.feed.total;
export const getFeedTotalToday = (state: RootState): number => state.feed.totalToday;
export const getFeedLoading = (state: RootState): boolean => state.feed.isLoading;

// --- Селекторы истории заказов ---
export const getProfileOrder = (state: RootState): TProfileOrdersState =>
  state.profileOrder;
export const getProfileOrdersSelector = (state: RootState): TOrder[] =>
  state.profileOrder.orders;
export const getProfileOrdersLoading = (state: RootState): boolean =>
  state.profileOrder.isLoading;
