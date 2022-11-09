export const allowedRepositiories = async (accessToken: string) => {
    const responseInstallations = await fetch('https://api.github.com/user/installations', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    const installationParse = await responseInstallations.json()
    const installationIds = installationParse.installations.map((installation: { id: string; target_type: string }) => ({ id: installation.id, targetType: installation.target_type }))
    const responseInstalledRepositoried = await Promise.all(installationIds.map(async ({ id, targetType }: { id: string; targetType: string }) => {
        const res = await fetch(
            `https://api.github.com/user/installations/${id}/repositories`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const { repositories } = await res.json();
        const names = repositories.map((x: { name: string; }) => x.name);
        const full_names = repositories.map((x_1: { full_name: string; }) => x_1.full_name);
        return {
            names, fullName: full_names[0].split('/')[0], targetType
        };
    }))
    return responseInstalledRepositoried;
}
