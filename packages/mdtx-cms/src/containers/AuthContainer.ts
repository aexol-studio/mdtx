import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ConnectionType } from '../mdtx-backend-zeus/selectors';
type IndexModalType = 'login' | 'register' | 'forgot' | undefined;

const AuthContainer = createContainer(() => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [token, setToken] = useLocalStorage('MDTXToken', '');
    const [integrations, setIntegrations] = useState<ConnectionType[] | undefined>();
    const [searchInService, setSearchInService] = useState<ConnectionType | undefined>();
    const handleSearchInService = (p?: ConnectionType) => setSearchInService(p);
    const [indexModal, setIndexModal] = useState<IndexModalType>();
    const handleModal = (p: IndexModalType) => setIndexModal(p);
    useEffect(() => {
        if (token === '') {
            setToken('');
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
        }
    }, [token]);

    const logOut = () => {
        setToken('');
        setIsLoggedIn(false);
        window.localStorage.removeItem('MDTXToken');
        router.push('/');
    };

    return {
        token,
        isLoggedIn,
        setIsLoggedIn,
        logOut,
        setToken,
        indexModal,
        handleModal,
        integrations,
        setIntegrations,
        searchInService,
        handleSearchInService,
    };
});

export const AuthProvider = AuthContainer.Provider;
export const useAuthState = AuthContainer.useContainer;
