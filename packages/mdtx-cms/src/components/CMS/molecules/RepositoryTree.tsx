import { FileIcon, FilePlusIcon, FolderIcon } from '@/src/assets';
import { useAuthState, useFileState } from '@/src/containers';
import { useOutsideClick } from '@/src/hooks/useOutsideClick';
import { TreeObject } from '@/src/utils/treeBuilder';
import { useRef, useState } from 'react';

export const RepositoryTree: React.FC<{
  tree?: TreeObject;
  root?: boolean;
  activePath?: string;
  activeFile?: TreeObject;
}> = ({ tree, root, activePath, activeFile }) => {
  const [creatingModal, setCreatingModal] = useState(false);
  const { setPickedFilePath, pickedFilePath, modifiedFiles } = useFileState();
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
  return (
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
                onClick={() => {
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
                  <div className="cursor-pointer group">
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
              key={v.name}
              activeFile={activeFile}
              activePath={tree.name}
              tree={v}
            />
          );
        })}
    </div>
  );
};
