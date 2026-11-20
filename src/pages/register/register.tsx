import { registerUser } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type LocationState = {
  from?: {
    pathname: string;
  };
};

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const { error } = useSelector((state) => state.user);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();

    void dispatch(registerUser({ name: userName, email, password }))
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          const from = state?.from?.pathname ?? '/';
          void navigate(from, { replace: true });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
