import {
  getIngredients,
  getProfileOrder,
  getFeed,
  getCurrentOrder,
} from '@/services/selectors';
import { fetchOrderByNumber } from '@/services/slices/orderSlice';
import { useSelector, useDispatch } from '@/services/store';
import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const { orders: profileOrders } = useSelector(getProfileOrder);
  const { orders: feedOrders } = useSelector(getFeed);
  const currentOrder = useSelector(getCurrentOrder);

  const ingredients: TIngredient[] = useSelector(getIngredients);

  const orderData = useMemo(() => {
    const orderFromProfile = profileOrders.find((o) => o.number === Number(number));
    const orderFromFeed = feedOrders.find((o) => o.number === Number(number));

    return (
      orderFromProfile ??
      orderFromFeed ??
      (currentOrder?.number === Number(number) ? currentOrder : null)
    );
  }, [number, profileOrders, feedOrders, currentOrder]);

  useEffect(() => {
    if (!orderData && number) {
      void dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [orderData, number, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
