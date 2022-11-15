import { RepositoriesType, RepositoryType, useBackend } from '@/src/backend';
import { ModelTypes } from '@/src/zeus';
import { allowedRepositioriesType } from '@/src/utils/allowedRepositiories';

export const setterForRespositoriesList = async (
  token: string,
  pagination: {
    orderBy?: ModelTypes['RepositoryOrder'];
    first?: number;
    last?: number;
  },
  selectedOrganization: string,
  allowedRepositories: allowedRepositioriesType[],
) => {
  const {
    getOrganizationRepositories,
    getUserRepositories,
    getUserRepositoryWithoutTree,
    getRepositoryWithoutTree,
    getOrganizationRepositoryWithoutTree,
  } = useBackend();
  const reducedAllowed = allowedRepositories.filter((value, index, self) =>
    value.fullAccess
      ? index ===
        self.findIndex(
          (t) =>
            t.fullName === value.fullName && t.fullAccess === value.fullAccess,
        )
      : true,
  );
  if (reducedAllowed.length) {
    return await Promise.all(
      reducedAllowed
        .map((allowedRepository) => {
          if (
            allowedRepository.fullAccess &&
            !allowedRepository.sharedByFriend
          ) {
            if (selectedOrganization !== '---') {
              // Organization repo's
              return getOrganizationRepositories(
                token,
                pagination,
                selectedOrganization,
              );
            }
            if (
              selectedOrganization === '---' &&
              allowedRepository.targetType === 'User'
            ) {
              // User repo's
              return getUserRepositories(token, pagination);
            }
          } else {
            // User repo's
            if (
              allowedRepository.targetType === 'User' &&
              !allowedRepository.sharedByFriend &&
              selectedOrganization === '---'
            ) {
              return getUserRepositoryWithoutTree(
                token,
                allowedRepository.name,
              );
            }
            // Shared repo's
            // if (
            //   allowedRepository.targetType === 'User' &&
            //   allowedRepository.sharedByFriend &&
            //   selectedOrganization === '---'
            // ) {
            //   return getRepositoryWithoutTree(
            //     token,
            //     allowedRepository.name,
            //     allowedRepository.fullName,
            //   );
            // }
            // Organization repo's
            if (
              allowedRepository.targetType === 'Organization' &&
              allowedRepository.fullName === selectedOrganization &&
              selectedOrganization !== '---'
            ) {
              return getOrganizationRepositoryWithoutTree(
                token,
                selectedOrganization,
                allowedRepository.name,
              );
            }
          }
        })
        .filter((withoutUndefined) => withoutUndefined),
    );
  }
};
