import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';

export type UserType = {
  login: string;
  avatar_url: string;
  name?: string;
};

const AuthConatiner = createContainer(() => {
  const [token, _setToken] = useState<string | undefined>();
  const [loggedData, setLoggedData] = useState<UserType>();
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
});

export const AuthProvider = AuthConatiner.Provider;
export const useAuthState = AuthConatiner.useContainer;
