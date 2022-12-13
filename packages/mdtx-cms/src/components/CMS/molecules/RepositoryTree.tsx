import { FileIcon, FilePlusIcon, FolderIcon, ThrashIcon } from '@/src/assets';
import {
  FileType,
  ToastType,
  useAuthState,
  useFileState,
  useToasts,
} from '@/src/containers';
import { useOutsideClick } from '@/src/hooks/useOutsideClick';
import { treeBuilder, TreeMenu, TreeObject } from '@/src/utils/treeBuilder';
import { useCallback, useEffect, useRef, useState } from 'react';

export const RepositoryTree: React.FC<{
  tree?: TreeObject;
  root?: boolean;
  activePath?: string;
  activeFile?: TreeObject;
  setRepositoryTree: React.Dispatch<React.SetStateAction<TreeMenu | undefined>>;
}> = ({ tree, root, activePath, activeFile, setRepositoryTree }) => {
  const [creatingModal, setCreatingModal] = useState(false);
  const [creatingFile, setCreatingFile] = useState(false);
  const [creatingFilePath, setCreatingFilePath] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const [fileWithOpenContext, setFileWithOpenContext] = useState<TreeObject>();
  const {
    files,
    orginalFiles,
    setPickedFilePath,
    pickedFilePath,
    modifiedFiles,
    setFiles,
    deletions,
    getSelectedFileByPath,
    setDeletions,
  } = useFileState();

  const hasChildren = !!tree?.children;
  const isFolder = hasChildren && !root;
  const [path, setPath] = useState(activePath);
  const ref = useRef<HTMLDivElement>(null);
  const refInput = useRef<HTMLInputElement>(null);
  const wantedImages = /(.*)\.(png|jpg|jpeg|gif|webp)$/;
  const notAllowed = (p: string) => !!p.match(wantedImages);
  const isImage = notAllowed(tree!.name);
  const [imgURL, setImgURL] = useState<string>();
  const clickHandler = () => {
    if (tree?.name) {
      if (isImage && tree.image) {
        const buffer = Buffer.from(tree.image);
        const base64String = buffer.toString('base64');
        setImgURL(base64String);
        return;
      }
      if (!isFolder && pickedFilePath !== tree?.path && tree) {
        setPickedFilePath(tree.path);
      }
      if (!isFolder && pickedFilePath === tree?.path) {
        setPickedFilePath(undefined);
      }
      if (isFolder && path !== tree.name) {
        setPath(tree?.name);
      }
      if (isFolder && path === tree.name) {
        setPath(undefined);
      }
    }
  };
  useOutsideClick(ref, () => setTimeout(() => setCreatingModal(false), 150));
  const { createToast } = useToasts();

  const deletingHandler = () => {
    const found = orginalFiles?.find(
      (x) => x.name === fileWithOpenContext?.path,
    );
    if (found)
      setDeletions((prev) => {
        return [...prev, found];
      });
    const newFiles = files.filter((x) => x.name !== fileWithOpenContext?.path);
    setFiles(newFiles);
    const treex = treeBuilder(newFiles);
    setRepositoryTree(treex);
  };
  const addingHandler = () => {
    const cleanFileName = fileName?.replaceAll('.md', '');
    if (creatingFilePath && fileName) {
      const found = files.find(
        (x) => x.name === creatingFilePath + fileName + '.md',
      );
      if (!found) {
        const x = creatingFilePath.slice(0, creatingFilePath.lastIndexOf('/'));
        setPath(x.slice(x.lastIndexOf('/') + 1));
        setFiles((prev) => {
          return [
            ...prev,
            {
              content: '',
              dir: false,
              name: creatingFilePath + cleanFileName + '.md',
            },
          ];
        });
        const treex = treeBuilder([
          ...files,
          {
            content: '',
            dir: false,
            name: creatingFilePath + cleanFileName + '.md',
          },
        ]);
        setRepositoryTree(treex);
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
      <div className={`pl-[0.8rem] w-full relative`}>
        {contextMenuState.showMenu && (
          <div
            ref={refContextMenu}
            className="z-[102] w-[12rem] py-[1.2rem] items-center top-[2.4rem] bg-mdtxBlack border-mdtxOrange1 border-[1px] absolute flex flex-col"
          >
            {isImage && (
              <div
                onClick={() => {
                  // if (utils) {
                  //   const newSelectionRange = utils.selectWord({
                  //     text: state.text,
                  //     selection: state.selection,
                  //   });
                  //   const state1 = api.setSelectionRange(newSelectionRange);
                  //   const state2 = api.replaceSelection(
                  //     `![Alt](${state1.selectedText})`,
                  //   );
                  //   api.setSelectionRange({
                  //     start:
                  //       state2.selection.end - 1 - state1.selectedText.length,
                  //     end: state2.selection.end - 1,
                  //   });
                  // }
                }}
                className="mb-[1.6rem] group flex gap-[0.4rem] items-center cursor-pointer w-fit"
              >
                {/* <div className="min-w-[2rem] min-h-[2rem]">
                  <ThrashIcon />
                </div> */}
                <p className="group-hover:underline w-fit uppercase text-[1rem] leading-[1.8rem] font-[700] select-none tracking-wider text-mdtxWhite">
                  Insert photo
                </p>
              </div>
            )}
            <div
              onClick={deletingHandler}
              className="group flex gap-[0.4rem] items-center cursor-pointer w-fit"
            >
              <div className="min-w-[2rem] min-h-[2rem]">
                <ThrashIcon />
              </div>
              <p className="group-hover:underline w-fit uppercase text-[1rem] leading-[1.8rem] font-[700] select-none tracking-wider text-mdtxWhite">
                Delete file
              </p>
            </div>
          </div>
        )}
        {tree?.name && (
          <div
            className={`${
              hasChildren && root
                ? 'mb-[1.2rem] cursor-default'
                : 'items-center py-[0.1rem]'
            } w-full flex`}
          >
            <div className="flex w-fit flex-1 gap-[0.8rem]">
              {isFolder && (
                <div className="w-fit flex items-center justify-center">
                  <FolderIcon selected={path === tree.name} />
                </div>
              )}

              {!hasChildren && (
                <div className="w-fit flex items-center justify-center">
                  <FileIcon
                    edited={!!modifiedFiles.find((x) => x.name === tree.path)}
                    selected={tree.path === pickedFilePath}
                  />
                </div>
              )}
              {!(hasChildren && root) && (
                <div
                  onContextMenu={(e) => {
                    if (!isFolder) {
                      handleContextMenu(e);
                      setFileWithOpenContext(tree);
                    }
                  }}
                  onClick={(e) => {
                    !(hasChildren && root) && clickHandler();
                    isImage && handleContextMenu(e);
                  }}
                  className="cursor-pointer"
                >
                  <p className={`hover:underline text-[1.4rem] text-white`}>
                    {tree?.name}
                  </p>
                </div>
              )}
            </div>
            {((hasChildren && root) || isFolder) && (
              <div className="relative flex items-center justify-center">
                <p
                  id={tree.name}
                  onClick={(e) => {
                    const { id } = e.currentTarget;
                    const pathFile = tree.path?.slice(
                      0,
                      tree.path.indexOf(id) + id.length + 1,
                    );
                    setCreatingFilePath(pathFile);
                    setCreatingModal((prev) => !prev);
                  }}
                  className="text-mdtxWhite cursor-pointer"
                >
                  +
                </p>
                {creatingModal && (
                  <div
                    ref={ref}
                    className="w-[13.2rem] flex items-center justify-center z-[100] bg-mdtxBlack py-[1.2rem] top-[1.8rem] right-[0rem] absolute border-mdtxWhite border-[1px]"
                  >
                    <div
                      onClick={() => {
                        setCreatingFile(true);
                        setCreatingModal(false);
                      }}
                      className="flex cursor-pointer group gap-[0.8rem]"
                    >
                      <p className="group-hover:underline cursor-pointer w-fit uppercase text-[1rem] leading-[1.8rem] font-[700] select-none tracking-wider text-mdtxWhite group-hover:text-mdtxOrange0">
                        Add new MD file
                      </p>
                      <div>
                        <FilePlusIcon />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {hasChildren &&
          (path === tree.name || root) &&
          tree.children?.map((v) => {
            return (
              <RepositoryTree
                setRepositoryTree={setRepositoryTree}
                key={v.name}
                activeFile={activeFile}
                activePath={tree.name}
                tree={v}
              />
            );
          })}
      </div>
      {creatingFile && (
        <div className="flex items-center gap-[1.2rem]">
          <input
            ref={refInput}
            className="w-[16rem] text-mdtxWhite ml-[1.2rem] my-[0.8rem] pl-[0.8rem] bg-transparent border-mdtxWhite border-[1px]"
            value={fileName ? fileName : ''}
            onBlur={() => {
              setCreatingFile(false);
            }}
            onKeyDown={(e) => {
              if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                addingHandler();
              }
            }}
            onChange={(e) => {
              setFileName(e.target.value);
            }}
          />
          <div className="min-w-fit" onClick={addingHandler}>
            <p className="text-mdtxOrange0 text-[1rem] uppercase tracking-wide font-[700]">
              Press enter
            </p>
          </div>
        </div>
      )}
    </>
  );
};
