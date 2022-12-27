import { ToastType, useFileState, useToasts } from '@/src/containers';
import { useOutsideClick } from '@/src/hooks/useOutsideClick';
import { treeBuilder, TreeMenu, TreeObject } from '@/src/utils/treeBuilder';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DeleteFileTree, FileInTree, FolderInTree, AddNewFileTree, TitleInTree, FolderOptionsTree } from '../atoms';

export const RepositoryTree: React.FC<{
    tree?: TreeObject;
    root?: boolean;
    activePath?: string;
    activeFile?: TreeObject;
    setRepositoryTree: React.Dispatch<React.SetStateAction<TreeMenu | undefined>>;
    handleUploadModal: (p: boolean) => void;
}> = ({ tree, root, activePath, activeFile, setRepositoryTree, handleUploadModal }) => {
    const { createToast } = useToasts();
    const {
        files,
        originalFiles,
        setPickedFilePath,
        pickedFilePath,
        modifiedFiles,
        setFiles,
        deletions,
        getSelectedFileByPath,
        setDeletions,
        setImageToAdd,
        creatingFilePath,
        setCreatingFilePath,
    } = useFileState();
    const [hover, setHover] = useState(false);
    const handleHover = () => setHover(!hover);
    const [creatingModal, setCreatingModal] = useState(false);
    const handleCreatingModal = () => setCreatingModal(prev => !prev);
    const [creatingFile, setCreatingFile] = useState(false);
    const handleCreateFile = (p: boolean) => setCreatingFile(p);
    const [fileName, setFileName] = useState<string>();
    const handleFileName = (p: string) => setFileName(p);
    const [fileWithOpenContext, setFileWithOpenContext] = useState<TreeObject>();

    const hasChildren = !!tree?.children;
    const isFolder = hasChildren && !root;
    const isFile = !hasChildren;
    const isTitle = hasChildren && root;
    const [path, setPath] = useState(activePath);
    const ref = useRef<HTMLDivElement>(null);
    const refInput = useRef<HTMLInputElement>(null);
    const onlyMDReg = /(.*)\.md$/;
    const onlyMD = (p: string) => !!p.match(onlyMDReg);
    const onlyIMGRef = /(.*)\.(png|jpg|jpeg|gif|webp)$/;
    const onlyIMG = (p: string) => !!p.match(onlyIMGRef);
    const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (tree) {
            //Moving on tree//
            if (isFile && pickedFilePath !== tree.path && tree.path && onlyMD(tree.path)) {
                //MD File
                setPickedFilePath(tree.path);
            }
            if (isFile && pickedFilePath !== tree.path && tree.path && onlyIMG(tree.path)) {
                //IMG File
                console.log(tree.path.slice(tree.path.indexOf('/') + 1));
            }
            if (isFile && pickedFilePath === tree.path && tree.path) {
                //OutClickFile
                setPickedFilePath(undefined);
            }
            if (isFolder && path !== tree.name) {
                //FolderClick
                setPath(tree.name);
            }
            if (isFolder && path === tree.name) {
                //FolderOutClick
                setPath(undefined);
            }
            //Moving on tree//
            //Additionals actions on tree//
            if (isFolder) {
                const { id } = e.currentTarget;
                const pathFile = tree.path?.slice(0, tree.path.indexOf(id) + id.length + 1);
                setCreatingFilePath(pathFile);
            }
            if (isTitle) {
                const { id } = e.currentTarget;
                const pathFile = tree.path?.slice(0, tree.path.indexOf(id) + id.length + 1);
                setCreatingFilePath(pathFile);
                handleCreateFile(true);
            }
            if (isFile) {
            }
            //Additionals actions on tree//
        }
    };

    useOutsideClick(ref, () => setTimeout(() => setCreatingModal(false), 150));

    const deletingHandler = () => {
        const found = originalFiles?.find(x => x.name === fileWithOpenContext?.path);
        if (found) setDeletions(prev => [...prev, found]);
        const newFiles = files.filter(x => x.name !== fileWithOpenContext?.path);
        setFiles(newFiles);
        const newTree = treeBuilder(newFiles);
        setRepositoryTree(newTree);
    };
    const addingHandler = () => {
        const cleanFileName = fileName?.replaceAll('.md', '');
        if (creatingFilePath && fileName) {
            const creatingPath = creatingFilePath + fileName + '.md';
            const found = files.find(x => x.name === creatingPath);
            const foundInDeletions = deletions.find(x => x.name === creatingPath);
            if (foundInDeletions) {
                setDeletions(prev => [...prev.filter(x => x.name !== creatingPath)]);
            }
            if (!found) {
                const sliced = creatingFilePath.slice(0, creatingFilePath.lastIndexOf('/'));
                setPath(sliced.slice(sliced.lastIndexOf('/') + 1));
                setFiles(prev => {
                    return [
                        ...prev,
                        {
                            content: undefined,
                            dir: false,
                            name: creatingFilePath + cleanFileName + '.md',
                            isCreated: true,
                        },
                    ];
                });
                const newTree = treeBuilder([
                    ...files,
                    {
                        content: undefined,
                        dir: false,
                        name: creatingFilePath + cleanFileName + '.md',
                    },
                ]);
                setRepositoryTree(newTree);
                setCreatingFile(false);
                createToast(ToastType.SUCCESS, 'Created file');
            } else {
                createToast(ToastType.ERROR, 'Cannot make file');
            }
        } else {
            createToast(ToastType.ERROR, 'Cannot make file');
        }
    };

    useEffect(() => {
        if (refInput.current) {
            refInput.current.focus();
        }
    }, [creatingFile]);

    const [contextMenuState, setContextMenuState] = useState<{
        xPos: string;
        yPos: string;
        showMenu: boolean;
    }>({
        showMenu: false,
        xPos: '0px',
        yPos: '0px',
    });

    const handleContextMenu = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.preventDefault();
            setImageToAdd(tree?.path);
            setContextMenuState({
                xPos: `${e.pageX}px`,
                yPos: `${e.pageY}px`,
                showMenu: true,
            });
        },
        [contextMenuState?.xPos, contextMenuState?.yPos],
    );

    const refContextMenu = useRef<HTMLDivElement>(null);
    useOutsideClick(refContextMenu, () =>
        setContextMenuState({
            showMenu: false,
            xPos: '0px',
            yPos: '0px',
        }),
    );

    return (
        <>
            <div className={`${root ? 'pl-[1.2rem]' : 'pl-[2.8rem]'} w-full relative`}>
                {contextMenuState.showMenu && (
                    <DeleteFileTree refContextMenu={refContextMenu} deletingHandler={deletingHandler} />
                )}
                {tree?.name && (
                    <div
                        className={`${
                            hasChildren && root ? 'mb-[1.6rem] cursor-default' : 'items-center '
                        } w-full flex items-center relative h-full`}>
                        <div
                            className={`${hover && !root ? 'bg-editor-hover0' : 'bg-transparent'} ${
                                !hover && !root && !isFolder && pickedFilePath === tree.path
                                    ? 'bg-editor-selection'
                                    : ''
                            } transition-colors duration-100 ease-in-out absolute left-[-100%] w-[200%] h-full  z-[1]`}
                        />
                        {creatingModal && (
                            <FolderOptionsTree
                                modalRef={ref}
                                handleUploadModal={handleUploadModal}
                                handleCreateFile={handleCreateFile}
                                handleCreatingModal={handleCreatingModal}
                            />
                        )}
                        <div
                            onMouseEnter={handleHover}
                            onMouseLeave={handleHover}
                            onClick={clickHandler}
                            draggable={!isFolder && onlyIMG(tree.path!)}
                            onDragStart={e => {
                                if (tree.path) {
                                    const pathToTransfer = tree.path.slice(tree.path.indexOf('/'));
                                    e.dataTransfer.setData('text', `![](${pathToTransfer.replaceAll(' ', '%20')})`);
                                    e.dataTransfer.effectAllowed = 'copyMove';
                                    e.dataTransfer.dropEffect = 'copy';
                                }
                            }}
                            id={tree.name}
                            className={`${!root ? 'ml-[-2.4rem]' : ''} ${
                                isTitle ? 'w-fit' : 'w-full flex-1'
                            } relative z-[2] cursor-pointer flex items-center gap-[0.8rem] transition-all duration-200 py-[0.8rem] `}>
                            {isTitle && <TitleInTree />}

                            {isFolder && (
                                <FolderInTree handleCreatingModal={handleCreatingModal} path={path} tree={tree}>
                                    <div className="flex-1">
                                        <p className={`text-[1.4rem] font-[500] leading-[1.8rem] text-white`}>
                                            {tree?.name}
                                        </p>
                                    </div>
                                </FolderInTree>
                            )}

                            {isFile && (
                                <FileInTree edited={!!modifiedFiles.find(x => x.name === tree.path)} tree={tree}>
                                    <div
                                        onContextMenu={e => {
                                            handleContextMenu(e);
                                            setFileWithOpenContext(tree);
                                        }}>
                                        <p className={`text-[1.4rem] font-[500] leading-[1.8rem] text-white`}>
                                            {tree?.name}
                                        </p>
                                    </div>
                                </FileInTree>
                            )}
                        </div>
                    </div>
                )}
                <AddNewFileTree
                    addingHandler={addingHandler}
                    creatingFile={creatingFile}
                    handleCreateFile={handleCreateFile}
                    refInput={refInput}
                    fileName={fileName}
                    handleFileName={handleFileName}
                />
                {hasChildren &&
                    (path === tree.name || root) &&
                    tree.children?.map(v => {
                        return (
                            <RepositoryTree
                                handleUploadModal={handleUploadModal}
                                setRepositoryTree={setRepositoryTree}
                                key={v.name}
                                activeFile={activeFile}
                                activePath={tree.name}
                                tree={v}
                            />
                        );
                    })}
            </div>
        </>
    );
};
