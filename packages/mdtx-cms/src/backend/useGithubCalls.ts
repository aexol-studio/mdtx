export const useGithubCalls = () => {
    const getRepository = async () => {
        const response = await fetch('https://api.github.com/repos/aexol-studio/mdtx', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseParse = await response.json();
        return responseParse;
    }
    const userInfo = async (accessToken: string) => {
        const response = await fetch('https://api.github.com/user', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        const responseParse = await response.json();
        return responseParse;
    }

    const getInstallationsForUser = async (accessToken: string) => {
        const response = await fetch(
            'https://api.github.com/user/installations',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        const responseParse = await response.json();
        return responseParse;
    }

    const getInstalledRepositoriesOnInstallation = async (id: string, accessToken: string) => {
        const response = await fetch(
            `https://api.github.com/user/installations/${id}/repositories`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        const responseParse = await response.json();
        return responseParse;
    }

    return {
        getRepository,
        userInfo,
        getInstallationsForUser,
        getInstalledRepositoriesOnInstallation
    }
}