import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { UserType } from '../backend/selectors/user.selector';

const useAuth = () => {
  const [token, _setToken] = useState<string | undefined>();
  const [loggedData, setLoggedData] = useState<Omit<UserType, 'organizations'>>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);


  useEffect(() => {
    const tok = window.localStorage.getItem('token');
    if (tok) {
      setToken(tok);
      setIsLoggedIn(true);
    }

  }, []);

  const setTokenWithLocal = (value: string) => {
    _setToken(value);
    setIsLoggedIn(true);
    window.localStorage.setItem('token', value);
  };

  const setToken = (value: string) => {
    _setToken(value);
    setIsLoggedIn(true);
  };

  const logOut = () => {
    setIsLoggedIn(false);
    _setToken(undefined);
    setLoggedData(undefined);
    window.localStorage.removeItem('token');
    window.document.location.reload();
    window.location.href = '/';
  };

  return {
    token,
    setToken,
    isLoggedIn,
    setIsLoggedIn,
    loggedData,
    setLoggedData,
    setTokenWithLocal,
    logOut,
  };
};

export const AuthConatiner = createContainer(useAuth);
