export const allowedRepositiories = async (accessToken: string) => {
    const responseInstallations = await fetch(
        'https://api.github.com/user/installations',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        },
    );
    const user = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    const orgs = await fetch('https://api.github.com/user/orgs', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    const loginData = await user.json();
    const { login } = loginData;
    const organizationsData = await orgs.json();
    const organizationNames = organizationsData.map((x: { login: string }) => x.login);
    const installationParse = await responseInstallations.json();
    const installationIds = installationParse.installations.map(
        (installation: { account: { login: any; }; id: any; target_type: any; }) => (installation.account.login === login || organizationNames.includes(installation.account.login)) && ({
            id: installation.id,
            targetType: installation.target_type,
        }),
    );
    const responseInstalledRepositoried = await Promise.all(
        installationIds.filter(Boolean).map(
            async ({ id, targetType }: { id: string; targetType: string }) => {
                const res = await fetch(
                    `https://api.github.com/user/installations/${id}/repositories`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    },
                );
                const { repositories } = await res.json();
                const names = repositories.map((x: { name: string }) => x.name);
                const full_names = repositories.map(
                    (x_1: { full_name: string }) => x_1.full_name,
                );
                return {
                    names,
                    fullName: full_names[0].split('/')[0],
                    targetType,
                };
            },
        ),
    );
    return responseInstalledRepositoried;
};
