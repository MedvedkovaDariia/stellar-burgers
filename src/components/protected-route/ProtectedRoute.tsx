import { getUser, getUserLoading } from '@/services/selectors';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { Preloader } from '../ui';

import type React from 'react';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

type LocationState = {
  from?: {
    pathname: string;
  };
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(getUser);
  const isLoading = useSelector(getUserLoading);
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (isLoading) return <Preloader />;

  if (onlyUnAuth && user) {
    const from = state?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
