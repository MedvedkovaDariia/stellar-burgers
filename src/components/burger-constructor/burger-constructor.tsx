import {
  getConstructorItems,
  getOrderRequest,
  getOrderModalData,
  getUser,
} from '@/services/selectors';
import { clearConstructor } from '@/services/slices/constructorSlice';
import { createOrder, clearOrder } from '@/services/slices/orderSlice';
import { useSelector, useDispatch } from '@/services/store';
import { BurgerConstructorUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect((): (() => void) => {
    return () => {
      dispatch(clearOrder());
    };
  }, [dispatch]);

  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const user = useSelector(getUser);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      void navigate('/login');
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(createOrder(ingredientsIds))
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          dispatch(clearConstructor());
        }
      })
      .catch((err) => console.error(err));
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
