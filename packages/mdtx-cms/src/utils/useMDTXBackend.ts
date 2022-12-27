import { useAuthState } from '../containers';
import { connectionSelector, LoginType } from '../mdtx-backend-zeus/selectors';
import { Chain, ValueTypes } from '../mdtx-backend-zeus/zeus';

const URI = process.env.NEXT_PUBLIC_MDTX_BACKEND || '';

export const useMDTXBackend = () => {
    const { token } = useAuthState();
    const chain = (method: 'query' | 'mutation') => {
        return Chain(URI, {
            headers: token
                ? {
                      'Content-Type': 'application/json',
                      Authorization: token,
                  }
                : {
                      'Content-Type': 'application/json',
                  },
        })(method);
    };
    const login = async (user: LoginType) => {
        const response = await chain('mutation')({
            login: [{ user }, true],
        });
        if (!response) throw new Error('Bad response from login - MDTX Backend');
        return response.login;
    };
    const register = async (user: LoginType) => {
        const response = await chain('mutation')({
            register: [{ user }, true],
        });
        if (!response) throw new Error('Bad response from register - MDTX Backend');
        return response.register;
    };
    const createConnection = async (connection: ValueTypes['CreateConnection']) => {
        const response = await chain('mutation')({
            admin: {
                createConnection: [{ connection }, true],
            },
        });
        if (!response) throw new Error('Bad response from createConnection - MDTX Backend');
        return response.admin?.createConnection;
    };
    const getConnections = async (_token?: string) => {
        const response = await Chain(URI, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: _token ? _token : token,
            },
        })('query')({ admin: { connections: connectionSelector } });
        if (!response) throw new Error('Bad response from connections - MDTX Backend');
        return response.admin?.connections;
    };
    const deleteConnection = async (_id: string) => {
        const response = await chain('mutation')({
            admin: {
                connection: [{ _id }, { delete: true }],
            },
        });
        if (!response) throw new Error('Bad response from deleteConnection - MDTX Backend');
        return response.admin?.connection?.delete;
    };
    const updateConnection = async (_id: string, connection: ValueTypes['UpdateConnection']) => {
        const response = await chain('mutation')({
            admin: {
                connection: [{ _id }, { update: [{ connection }, true] }],
            },
        });
        if (!response) throw new Error('Bad response from deleteConnection - MDTX Backend');
        return response.admin?.connection?.update;
    };
    const addRepository = async (_id: string, repository: ValueTypes['CreateRepository']) => {
        const response = await chain('mutation')({
            admin: {
                connection: [{ _id }, { addRepository: [{ repository }, true] }],
            },
        });
        if (!response) throw new Error('Bad response from deleteConnection - MDTX Backend');
        return response.admin?.connection?.addRepository;
    };
    return {
        login,
        register,
        getConnections,
        createConnection,
        deleteConnection,
        updateConnection,
        addRepository,
    };
};
