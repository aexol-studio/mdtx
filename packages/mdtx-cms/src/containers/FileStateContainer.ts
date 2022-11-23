import { file } from 'jszip';
import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';

export type FileType = {
  content: string;
  dir: boolean;
  name: string;
};

const FileStateContainer = createContainer(() => {
  const [files, setFiles] = useState<FileType[]>();
  const [orginalFiles, setOrginalFiles] = useState<FileType[]>();
  const [modifiedFiles, setModifiedFiles] = useState<FileType[]>([]);
  const [imagesToDisplay, setImagesToDisplay] = useState<FileType[]>();
  const [pickedFilePath, setPickedFilePath] = useState<string>();
  const [isFilesDirty, setIsFilesDirty] = useState(false);

  const temp = imagesToDisplay?.map((x) => {
    return x.name.slice(x.name.indexOf('/') + 1);
  });
  console.log(temp);
  const resetState = () => {
    setOrginalFiles(undefined);
    setModifiedFiles([]);
    setFiles(undefined);
    setImagesToDisplay(undefined);
    setPickedFilePath(undefined);
    setIsFilesDirty(false);
  };

  useEffect(() => {
    if (JSON.stringify(files) === JSON.stringify(orginalFiles)) {
      setIsFilesDirty(false);
      setModifiedFiles([]);
    } else {
      setIsFilesDirty(true);
    }
  }, [files]);
  const getSelectedFileByPath = () => {
    return files?.find((x) => x.name === pickedFilePath);
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
    imagesToDisplay,
    setImagesToDisplay,
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
    temp,
  };
});

export const FileStateProvider = FileStateContainer.Provider;
export const useFileState = FileStateContainer.useContainer;
