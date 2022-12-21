// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import { createContainer } from 'unstated-next';
// import { useLocalStorage } from '../hooks/useLocalStorage';

// export type UserType = {
//   login: string;
//   html_url: string;
//   avatar_url: string;
//   name: string | null;
// };
// type ServiceType = 'gitlab' | 'github';

// const AuthConatiner = createContainer(() => {
//   const router = useRouter();
//   const [loggedData, setLoggedData] = useState<UserType>();
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [service, setService] = useLocalStorage<ServiceType | 'none'>(
//     'MDTXPickedService',
//     'none',
//   );
//   const [serviceURL, setServiceURL] = useLocalStorage< | 'none'>(
//     'MDTXPickedService',
//     'none',
//   );
//   const [token, setToken] = useLocalStorage('MDTXToken', '');

//   useEffect(() => {
//     if (token === '' || service === 'none') {
//       setService('none');
//       setServiceURL('none');
//       setToken('');
//       setIsLoggedIn(false);
//       setLoggedData(undefined);
//     } else {
//       setIsLoggedIn(true);
//     }
//   }, [service, token]);

//   const logOut = () => {
//     setService('none');
//     setServiceURL('none');
//     setToken('');
//     setIsLoggedIn(false);
//     setLoggedData(undefined);
//     window.localStorage.removeItem('token');
//     router.push('/');
//   };

//   return {
//     token,
//     isLoggedIn,
//     setIsLoggedIn,
//     loggedData,
//     setLoggedData,
//     logOut,
//     setToken,
//     service,
//     setService,
//     serviceURL,
//     setServiceURL,
//   };
// });

// export const AuthProvider = AuthConatiner.Provider;
// export const useAuthState = AuthConatiner.useContainer;
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';

export type UserType = {
  login: string;
  html_url: string;
  avatar_url: string;
  name: string | null;
};

const AuthConatiner = createContainer(() => {
  const router = useRouter();
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
    router.push('/');
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
