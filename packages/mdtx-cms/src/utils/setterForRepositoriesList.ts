import { RepositoriesType, RepositoryType, useBackend } from '@/src/backend';
import { ModelTypes } from '@/src/zeus';
import { allowedRepositioriesType } from '@/src/utils/allowedRepositiories';

const setterFunction = (
  setRepositoriesList: React.Dispatch<
    React.SetStateAction<RepositoriesType | undefined>
  >,
  responseAllRepositories?: RepositoriesType,
  responseRespository?: RepositoryType,
) => {
  if (responseAllRepositories) {
    setRepositoriesList((prev) => {
      return { ...prev, nodes: responseAllRepositories.nodes };
    });
  } else {
    setRepositoriesList((prev) => {
      return prev;
    });
  }
  if (responseRespository) {
    setRepositoriesList((prev) => {
      if (prev) {
        if (prev.nodes) {
          return { ...prev, nodes: [...prev.nodes, responseRespository] };
        } else {
          return { ...prev, nodes: [responseRespository] };
        }
      } else {
        return { nodes: [responseRespository] };
      }
    });
  } else {
    setRepositoriesList((prev) => {
      return prev;
    });
  }
};

export const setterForRespositoriesList = (
  token: string,
  pagination: {
    orderBy?: ModelTypes['RepositoryOrder'];
    first?: number;
    last?: number;
  },
  selectedOrganization: string,
  allowedRepositories: allowedRepositioriesType[],
  setRepositoriesList: React.Dispatch<
    React.SetStateAction<RepositoriesType | undefined>
  >,
  setLoadingFullTree: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const {
    getOrganizationRepositories,
    getUserRepositories,
    getUserRepositoryWithoutTree,
    getRepositoryWithoutTree,
    getOrganizationRepositoryWithoutTree,
  } = useBackend();
  let done = false;
  setRepositoriesList(undefined);
  setLoadingFullTree(true);

  const reducedAllowed = allowedRepositories?.filter(
    (v, i, a) =>
      a.findIndex(
        (v2) => v.fullAccess === v2.fullAccess && v.fullName === v2.fullName,
      ) === i,
  );
  if (reducedAllowed.length) {
    reducedAllowed.forEach((allowedRepository, index) => {
      if (allowedRepository.fullAccess && !allowedRepository.sharedByFriend) {
        if (selectedOrganization !== '---') {
          // Organization repo's
          getOrganizationRepositories(
            token,
            pagination,
            selectedOrganization,
          ).then((response) => {
            if (response) {
              setterFunction(setRepositoriesList, response, undefined);
            }
          });
        }
        if (
          selectedOrganization === '---' &&
          allowedRepository.targetType === 'User'
        ) {
          // User repo's
          getUserRepositories(token, pagination).then((response) => {
            if (response) {
              setterFunction(setRepositoriesList, response, undefined);
            }
          });
        }
      } else {
        // User repo's
        if (
          allowedRepository.targetType === 'User' &&
          !allowedRepository.sharedByFriend &&
          selectedOrganization === '---'
        ) {
          getUserRepositoryWithoutTree(token, allowedRepository.name).then(
            (response) =>
              response &&
              setterFunction(setRepositoriesList, undefined, response),
          );
        }
        // Shared repo's
        if (
          allowedRepository.targetType === 'User' &&
          allowedRepository.sharedByFriend &&
          selectedOrganization === '---'
        ) {
          getRepositoryWithoutTree(
            token,
            allowedRepository.name,
            allowedRepository.fullName,
          ).then(
            (response) =>
              response &&
              setterFunction(setRepositoriesList, undefined, response),
          );
        }
        // Organization repo's
        if (
          allowedRepository.targetType === 'Organization' &&
          allowedRepository.fullName === selectedOrganization &&
          selectedOrganization !== '---'
        ) {
          getOrganizationRepositoryWithoutTree(
            token,
            selectedOrganization,
            allowedRepository.name,
          ).then(
            (response) =>
              response &&
              setterFunction(setRepositoriesList, undefined, response),
          );
        }
      }
      if (index === reducedAllowed.length - 1) {
        done = true;
      }
    });
    if (done) {
      setLoadingFullTree(false);
    }
  }
};
