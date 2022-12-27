import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { useAuthState } from './AuthContainer';
import { useGitState } from './GitContainer';
import { useRepositoryState } from './RepositoryStateContainer';

export type FileType = {
    dir: boolean;
    name: string;
    content?: string;
    image?: ArrayBuffer;
    isCreated?: boolean;
};

const FileStateContainer = createContainer(() => {
    const [files, setFiles] = useState<FileType[]>([]);
    const [originalFiles, setOriginalFiles] = useState<FileType[] | undefined>();
    const [modifiedFiles, setModifiedFiles] = useState<FileType[]>([]);
    const [deletions, setDeletions] = useState<FileType[]>([]);
    const [imageToAdd, setImageToAdd] = useState<string>();
    const [pickedFilePath, setPickedFilePath] = useState<string>();
    const [isFilesTouched, setIsFilesTouched] = useState(false);
    const [creatingFilePath, setCreatingFilePath] = useState<string>();
    const { selectedBranch, selectedRepository } = useRepositoryState();
    const [block, setBlock] = useState(false);
    const { getFile } = useGitState();
    const { searchInService } = useAuthState();
    const resetState = () => {
        setOriginalFiles(undefined);
        setModifiedFiles([]);
        setFiles([]);
        setDeletions([]);
        setPickedFilePath(undefined);
        setIsFilesTouched(false);
    };
    useEffect(() => {
        if (
            JSON.stringify(files.filter(z => z.name.includes('.md'))) ===
            JSON.stringify(originalFiles?.filter(z => z.name.includes('.md')))
        ) {
            setIsFilesTouched(false);
            setModifiedFiles([]);
        } else {
            setIsFilesTouched(true);
        }
    }, [files]);

    useEffect(() => {
        const found = files?.find(x => x.name === pickedFilePath);
        const foundInOriginal = originalFiles?.find(x => x.name === found?.name);
        const owner = selectedRepository?.full_name.split('/');
        const ref = selectedBranch?.name;
        if (searchInService && owner && ref && found && found.content === undefined) {
            setBlock(true);
            if (foundInOriginal) {
                getFile(
                    {
                        owner: owner[0],
                        repo: owner[1],
                        branch: ref ? ref : 'develop',
                        path: found.name.slice(found.name.indexOf('/') + 1),
                    },
                    searchInService,
                ).then(res => {
                    if (res) {
                        setFiles(prev => {
                            const toSet = [
                                ...prev.filter(
                                    x =>
                                        x.name.slice(x.name.indexOf('/') + 1) !==
                                        found.name.slice(found.name.indexOf('/') + 1),
                                ),
                                {
                                    content:
                                        'content' in res ? Buffer.from(res.content, 'base64').toString('utf-8') : '',
                                    dir: false,
                                    name: found.name,
                                },
                            ];
                            setBlock(false);
                            return toSet;
                        });
                        setOriginalFiles(prev => {
                            if (prev) {
                                const toSet = [
                                    ...prev.filter(
                                        x =>
                                            x.name.slice(x.name.indexOf('/') + 1) !==
                                            found.name.slice(found.name.indexOf('/') + 1),
                                    ),
                                    {
                                        content:
                                            'content' in res
                                                ? Buffer.from(res.content, 'base64').toString('utf-8')
                                                : '',
                                        dir: false,
                                        name: found.name,
                                    },
                                ];
                                setBlock(false);
                                return toSet;
                            } else {
                                setBlock(false);
                                return prev;
                            }
                        });
                    }
                });
            } else {
                setOriginalFiles(files);
                setBlock(false);
            }
        }
    }, [pickedFilePath]);

    const getSelectedFileByPath = () => {
        const found = files?.find(x => x.name === pickedFilePath);
        return !block ? found : { ...found, content: '' };
    };
    const setSelectedFileContentByPath = (content: string) => {
        setFiles(prev =>
            prev?.map(x => {
                if (x.name === pickedFilePath) {
                    setModifiedFiles(prev => {
                        const originalContent = originalFiles?.find(x => x.name === pickedFilePath);
                        if (prev) {
                            if (x.name === pickedFilePath) {
                                if (content === originalContent?.content) {
                                    return [...prev.filter(x => x.name !== pickedFilePath)];
                                } else {
                                    return [
                                        ...prev.filter(x => x.name !== pickedFilePath),
                                        {
                                            name: pickedFilePath,
                                            dir: false,
                                            content,
                                            isCreated: x.isCreated,
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
        block,
        setBlock,
        pickedFilePath,
        setPickedFilePath,
        files,
        setFiles,
        originalFiles,
        setOriginalFiles,
        modifiedFiles,
        getSelectedFileByPath,
        setSelectedFileContentByPath,
        isFilesTouched,
        setIsFilesTouched,
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
