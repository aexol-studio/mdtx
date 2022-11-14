import {
  RepositoryContentType,
  RepositoryType,
  useBackend,
} from '@/src/backend';

const cleanRepositoryContentAndSort = (
  repositoryContent: RepositoryContentType,
) => {
  return {
    object: {
      entries: repositoryContent?.object?.entries
        ?.filter(
          (file) =>
            file.extension === '.md' ||
            (file.extension === '' && file.type === 'tree'),
        )
        .sort((file) => {
          if (file.extension === '.md') {
            return -1;
          }
          return 0;
        }),
    },
  };
};

const setterFunction = (
  setSelectedRepositoryContent: React.Dispatch<
    React.SetStateAction<RepositoryContentType | undefined>
  >,
  setLoadingSubTree: React.Dispatch<React.SetStateAction<boolean>>,
  response?: RepositoryContentType,
) => {
  if (response) {
    setSelectedRepositoryContent(cleanRepositoryContentAndSort(response));
  } else {
    setSelectedRepositoryContent(undefined); // Empty Repository State !
  }
  setLoadingSubTree(false);
};
const { getUserRepository, getRepository, getOrganizationRepository } =
  useBackend();
export const setterForRespositoryContent = (
  token: string,
  contentPath: string,
  selectedOrganization: string,
  selectedBranch: string,
  selectedRepository: RepositoryType,
  isOwner: boolean,
  setSelectedRepositoryContent: React.Dispatch<
    React.SetStateAction<RepositoryContentType | undefined>
  >,
  setLoadingSubTree: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (isOwner) {
    getUserRepository(
      token,
      selectedRepository.name,
      contentPath,
      selectedBranch,
    ).then((response) =>
      setterFunction(setSelectedRepositoryContent, setLoadingSubTree, response),
    );
  } else {
    if (selectedOrganization === '---') {
      getRepository(
        token,
        selectedRepository.owner.login,
        selectedRepository.name,
        contentPath,
        selectedBranch,
      ).then((response) =>
        setterFunction(
          setSelectedRepositoryContent,
          setLoadingSubTree,
          response,
        ),
      );
    } else {
      getOrganizationRepository(
        token,
        selectedRepository.name,
        contentPath,
        selectedBranch,
        selectedOrganization,
      ).then((response) =>
        setterFunction(
          setSelectedRepositoryContent,
          setLoadingSubTree,
          response,
        ),
      );
    }
  }
};
