import { FileIcon, FilePlusIcon, FolderIcon } from '@/src/assets';
import {
  FileType,
  ToastType,
  useAuthState,
  useFileState,
  useToasts,
} from '@/src/containers';
import { useOutsideClick } from '@/src/hooks/useOutsideClick';
import { treeBuilder, TreeMenu, TreeObject } from '@/src/utils/treeBuilder';
import { useRef, useState } from 'react';

export const RepositoryTree: React.FC<{
  tree?: TreeObject;
  root?: boolean;
  activePath?: string;
  activeFile?: TreeObject;
  files: FileType[];
  setRepositoryTree: React.Dispatch<React.SetStateAction<TreeMenu | undefined>>;
}> = ({ files, tree, root, activePath, activeFile, setRepositoryTree }) => {
  const [creatingModal, setCreatingModal] = useState(false);
  const [creatingFile, setCreatingFile] = useState(false);
  const [creatingFilePath, setCreatingFilePath] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const {
    setPickedFilePath,
    pickedFilePath,
    modifiedFiles,
    setFiles,
    setModifiedFiles,
  } = useFileState();
  const hasChildren = !!tree?.children;
  const isFolder = hasChildren && !root;
  const [path, setPath] = useState(activePath);
  const ref = useRef<HTMLDivElement>(null);
  const clickHandler = () => {
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
  };
  useOutsideClick(ref, () => setTimeout(() => setCreatingModal(false), 150));
  const { createToast } = useToasts();

  const addingHandler = () => {
    const found = files.find(
      (x) =>
        x.name.slice(x.name.lastIndexOf('/') + 1).replaceAll('.md', '') ===
        fileName,
    );
    const cleanFileName = fileName?.replaceAll('.md', '');
    if (!found && creatingFilePath && fileName) {
      setModifiedFiles((prev) => {
        return [
          ...prev,
          {
            content: '',
            dir: false,
            name: creatingFilePath + cleanFileName + '.md',
          },
        ];
      });
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
  };
  return (
    <>
      <div className={`pl-[0.8rem] w-full relative`}>
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
                  onClick={() => !(hasChildren && root) && clickHandler()}
                  className="cursor-pointer"
                >
                  <p className={`hover:underline text-[1.4rem] text-white`}>
                    {tree?.name}
                  </p>
                </div>
              )}
            </div>
            {isFolder && (
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
                    className="z-[100] bg-mdtxBlack px-[0.8rem] py-[1.2rem] top-[1.8rem] right-[0rem] absolute border-mdtxWhite border-[1px]"
                  >
                    <div
                      onClick={() => {
                        setCreatingFile(true);
                        setCreatingModal(false);
                      }}
                      className="cursor-pointer group"
                    >
                      <FilePlusIcon />
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
                files={files}
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
            className="text-mdtxWhite ml-[1.2rem] my-[0.8rem] pl-[0.8rem] bg-transparent border-mdtxWhite border-[1px]"
            value={fileName}
            onKeyDown={(e) => {
              if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                addingHandler();
              }
            }}
            onChange={(e) => {
              setFileName(e.target.value);
            }}
          />
          <div onClick={addingHandler}>
            <p className="text-mdtxOrange0">+</p>
          </div>
        </div>
      )}
    </>
  );
};
