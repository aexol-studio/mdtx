import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { useGitHub } from '../utils';
import { useRepositoryState } from './RepositoryStateContainer';

export type FileType = {
  dir: boolean;
  name: string;
  content?: string;
  image?: ArrayBuffer;
};

const FileStateContainer = createContainer(() => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [orginalFiles, setOrginalFiles] = useState<FileType[]>();
  const [modifiedFiles, setModifiedFiles] = useState<FileType[]>([]);
  const [deletions, setDeletions] = useState<FileType[]>([]);
  const [imageToAdd, setImageToAdd] = useState<string>();
  const [pickedFilePath, setPickedFilePath] = useState<string>();
  const [isFilesDirty, setIsFilesDirty] = useState(false);
  const [creatingFilePath, setCreatingFilePath] = useState<string>();
  const { selectedBranch, selectedRepository } = useRepositoryState();
  const { getContents } = useGitHub();
  const resetState = () => {
    setOrginalFiles(undefined);
    setModifiedFiles([]);
    setFiles([]);
    setDeletions([]);
    setPickedFilePath(undefined);
    setIsFilesDirty(false);
  };
  const [block, setBlock] = useState(false);
  useEffect(() => {
    if (
      JSON.stringify(files.filter((z) => z.name.includes('.md'))) ===
      JSON.stringify(orginalFiles?.filter((z) => z.name.includes('.md')))
    ) {
      setIsFilesDirty(false);
      setModifiedFiles([]);
    } else {
      setIsFilesDirty(true);
    }
  }, [files]);

  useEffect(() => {
    const found = files?.find((x) => x.name === pickedFilePath);
    const owner = selectedRepository?.full_name.split('/');
    const ref = selectedBranch?.name;

    if (ref && owner && found && found?.content === undefined) {
      setBlock(true);
      getContents({
        owner: owner[0],
        repo: owner[1],
        ref: selectedBranch?.name,
        path: found.name.slice(found.name.indexOf('/') + 1),
      }).then((z) =>
        setFiles((prev) => {
          setBlock(false);
          return [
            ...prev.filter(
              (x) =>
                x.name.slice(x.name.indexOf('/') + 1) !==
                found.name.slice(found.name.indexOf('/') + 1),
            ),
            {
              content:
                'content' in z
                  ? Buffer.from(z.content, 'base64').toString('utf-8')
                  : '',
              dir: false,
              name: found.name,
            },
          ];
        }),
      );
      setOrginalFiles(files);
    }
  }, [pickedFilePath]);

  const getSelectedFileByPath = () => {
    const found = files?.find((x) => x.name === pickedFilePath);
    return !block ? found : { ...found, content: '' };
  };
  const setSelectedFileContentByPath = (content: string) => {
    setFiles((prev) =>
      prev?.map((x) => {
        if (x.name === pickedFilePath) {
          setModifiedFiles((prev) => {
            const orginalContent = orginalFiles?.find(
              (x) => x.name === pickedFilePath,
            );
            if (prev) {
              if (x.name === pickedFilePath) {
                if (content === orginalContent?.content) {
                  return [...prev.filter((x) => x.name !== pickedFilePath)];
                } else {
                  return [
                    ...prev.filter((x) => x.name !== pickedFilePath),
                    {
                      name: pickedFilePath,
                      dir: false,
                      content,
                    },
                  ];
                }
              } else {
                return [
                  ...prev,
                  {
                    name: pickedFilePath,
                    dir: false,
                    content,
                  },
                ];
              }
            } else {
              return [
                {
                  content,
                  dir: false,
                  name: pickedFilePath,
                },
              ];
            }
          });

          return { ...x, content };
        } else {
          return x;
        }
      }),
    );
  };
  return {
    pickedFilePath,
    setPickedFilePath,
    files,
    setFiles,
    orginalFiles,
    setOrginalFiles,
    modifiedFiles,
    getSelectedFileByPath,
    setSelectedFileContentByPath,
    isFilesDirty,
    resetState,
    setModifiedFiles,
    deletions,
    setDeletions,
    imageToAdd,
    setImageToAdd,
    creatingFilePath,
    setCreatingFilePath,
  };
});

export const FileStateProvider = FileStateContainer.Provider;
export const useFileState = FileStateContainer.useContainer;
