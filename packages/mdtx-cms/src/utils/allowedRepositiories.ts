import { useGithubCalls } from '@/src/backend/useGithubCalls';

export type allowedRepositioriesType = {
  name: string;
  fullName: string;
  targetType: string;
  fullAccess: boolean;
  sharedByFriend: boolean;
  permission: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
};

export const allowedRepositiories = async (
  accessToken: string,
): Promise<allowedRepositioriesType[]> => {
  const {
    userInfo,
    getInstallationsForUser,
    getInstalledRepositoriesOnInstallation,
  } = useGithubCalls();
  const loginDataPromise = userInfo(accessToken);
  const installationsPromise = getInstallationsForUser(accessToken);
  const [loginData, installationParse] = await Promise.all([
    loginDataPromise,
    installationsPromise,
  ]);
  const { login } = loginData;
  const installationIds = installationParse.installations?.map(
    (installation: {
      account: { login: string };
      id: string;
      repository_selection: 'selected' | 'all';
      target_type: string;
      sharedByFriend: boolean;
      permissions: {
        admin: boolean;
        maintain: boolean;
        push: boolean;
        triage: boolean;
        pull: boolean;
      };
    }) => {
      return {
        id: installation.id,
        targetType: installation.target_type,
        fullAccess: installation.repository_selection,
        sharedByFriend: installation.account.login !== login,
        permissions: installation.permissions,
      };
    },
  );
  const responseInstalledRepositoried: allowedRepositioriesType[][] =
    await Promise.all(
      installationIds
        ?.filter(Boolean)
        .map(
          async ({
            id,
            targetType,
            fullAccess,
            sharedByFriend,
          }: {
            id: string;
            targetType: string;
            fullAccess: 'selected' | 'all';
            sharedByFriend: boolean;
          }) => {
            const installation = await getInstalledRepositoriesOnInstallation(
              id,
              accessToken,
            );
            const { repositories } = installation;
            const installedRepositories: allowedRepositioriesType[] =
              repositories.map(
                (x: {
                  name: string;
                  full_name: string;
                  permissions: {
                    admin: boolean;
                    maintain: boolean;
                    push: boolean;
                    triage: boolean;
                    pull: boolean;
                  };
                }) => ({
                  name: x.name,
                  fullName: x.full_name.split('/')[0],
                  targetType: targetType,
                  fullAccess: fullAccess === 'all',
                  sharedByFriend:
                    targetType !== 'Organization' && sharedByFriend,
                  permissions: x.permissions,
                }),
              );
            return installedRepositories;
          },
        ),
    );
  const reduceVal = responseInstalledRepositoried?.reduce((prev, current) => [
    ...prev,
    ...current,
  ]);
  return reduceVal;
};
