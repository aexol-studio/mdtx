import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';

const useAuth = () => {
  const [token, _setToken] = useState<string | undefined>();
  const [userName, setUserName] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState<'yes' | 'no'>('no');

  useEffect(() => {
    const tok = window.localStorage.getItem('token');
    if (tok) {
      setToken(tok);
      setIsLoggedIn('yes');
    }
  }, []);

  const setTokenWithLocal = (value: string) => {
    _setToken(value);
    setIsLoggedIn('yes');
    window.localStorage.setItem('token', value);
  };

  const setToken = (value: string) => {
    _setToken(value);
    setIsLoggedIn('yes');
  };

  const logOut = () => {
    setIsLoggedIn('no');
    _setToken(undefined);
    setUserName(undefined);
    window.localStorage.removeItem('token');
    window.document.location.reload();
  };

  return {
    token,
    setToken,
    setTokenWithLocal,
    logOut,
    isLoggedIn,
    setIsLoggedIn,
    userName,
    setUserName,
  };
};

export const AuthConatiner = createContainer(useAuth);
