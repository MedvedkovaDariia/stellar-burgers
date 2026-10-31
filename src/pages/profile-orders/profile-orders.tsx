import { Preloader } from '@/components/ui';
import { getProfileOrders } from '@/services/slices/profileOrderSlice';
import { useSelector, useDispatch } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.profileOrder);

  useEffect(() => {
    void dispatch(getProfileOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
