import { useDispatch, useSelector } from '@/services/store';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { loginUser, clearError } from '../../services/slices/userSlice';

type LocationState = {
  from?: {
    pathname: string;
  };
};

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const { error } = useSelector((state) => state.user);

  useEffect(() => {
    void dispatch(clearError());
  }, [dispatch]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(loginUser({ email, password }))
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          const from = state?.from?.pathname ?? '/';
          void navigate(from, { replace: true });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
