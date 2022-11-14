import { useBackend } from '@/src/backend';

export const setterForContentFile = (
  token: string,
  selectedRepository: any,
  contentPath: string,
  selectedBranch: string,
  selectedOrganization: string,
  isOwner: boolean,
  setMarkdownEdit: React.Dispatch<React.SetStateAction<string | undefined>>,
  setMarkdownBase: React.Dispatch<React.SetStateAction<string | undefined>>,
) => {
  const {
    getFileContentFromUserRepository,
    getFileContentFromRepository,
    getFileContentFromOrganization,
  } = useBackend();
  if (isOwner) {
    getFileContentFromUserRepository(
      token!,
      selectedRepository!.name,
      contentPath,
      selectedBranch!,
    ).then((res) => {
      setMarkdownEdit(res?.object?.text);
      setMarkdownBase(res?.object?.text);
    });
  } else {
    if (selectedOrganization === '---') {
      getFileContentFromRepository(
        token!,
        selectedRepository!.owner.login,
        selectedRepository!.name,
        contentPath,

        selectedBranch!,
      ).then((res) => {
        setMarkdownEdit(res?.object?.text);
        setMarkdownBase(res?.object?.text);
      });
    } else {
      getFileContentFromOrganization(
        token!,
        selectedRepository!.name,
        contentPath,
        selectedOrganization,
        selectedBranch!,
      ).then((res) => {
        setMarkdownEdit(res?.object?.text);
        setMarkdownBase(res?.object?.text);
      });
    }
  }
};
