import { FileIcon, FolderIcon } from '@/src/assets';
import { useAuthState, useFileState } from '@/src/containers';
import { TreeObject } from '@/src/utils/treeBuilder';
import { useState } from 'react';
import Image from 'next/image';
import { RepositoryFromSearch } from '@/src/pages/editor';

export const RepositoryTree: React.FC<{
  tree?: TreeObject;
  root?: boolean;
  activePath?: string;
  activeFile?: TreeObject;
  selectedRepository?: RepositoryFromSearch;
  forksOnRepo?: {
    full_name: string;
  }[];
}> = ({
  tree,
  root,
  activePath,
  activeFile,
  selectedRepository,
  forksOnRepo,
}) => {
  const { loggedData } = useAuthState();
  const [tooltip, setTooltip] = useState(false);
  const [creatingModal, setCreatingModal] = useState(false);
  const { setPickedFilePath, pickedFilePath, modifiedFiles } = useFileState();
  const hasChildren = !!tree?.children;
  const isFolder = hasChildren && !root;
  const [path, setPath] = useState(activePath);
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
          {hasChildren && root && (
            <div className="relative w-full flex items-center justify-between">
              {tooltip ? (
                <div className="z-[102] absolute top-[3.2rem] right-0">
                  <div className="shadow-mdtxShadow0 max-w-[25rem] py-[1.6rem] px-[0.8rem] bg-mdtxBlack border-[1px] border-mdtxOrange0 rounded-[0.6rem]">
                    <p className="text-white select-none text-[1.2rem]">
                      Repository name:{' '}
                      <strong>{selectedRepository?.name}</strong>
                    </p>
                    <p className="text-white select-none text-[1.2rem]">
                      Is forked respository:{' '}
                      <strong>{selectedRepository?.fork ? 'yes' : 'no'}</strong>
                    </p>
                    <p className="text-white select-none text-[1.2rem]">
                      Already forked by logged user:{' '}
                      <strong>
                        {forksOnRepo?.find((x) =>
                          x.full_name.includes(loggedData!.login),
                        )
                          ? 'yes'
                          : 'no'}
                      </strong>
                    </p>
                    <p className="text-white select-none text-[1.2rem]">
                      Is your repository:{' '}
                      <strong>
                        {selectedRepository?.full_name.includes(
                          loggedData!.login,
                        )
                          ? 'yes'
                          : 'no'}
                      </strong>
                    </p>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <p className="text-white leading-[1.8rem] select-none text-center text-[1.2rem] font-[700] uppercase tracking-wider">
                Repository:&nbsp;
              </p>
              <div className="flex justify-center items-center gap-[0.8rem]">
                <p className="text-white select-none text-center text-[1.2rem]">
                  {selectedRepository?.owner.login}
                </p>
                <Image
                  onMouseEnter={() => {
                    setTooltip(true);
                  }}
                  onMouseLeave={() => {
                    setTooltip(false);
                  }}
                  priority
                  width={24}
                  height={24}
                  className="cursor-help rounded-full"
                  alt="User Logo"
                  src={selectedRepository?.owner.avatar_url || ''}
                />
              </div>
            </div>
          )}
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
            <div
              onClick={() => {
                setCreatingModal(true);
              }}
              className="flex items-center justify-center"
            >
              <p className="text-mdtxWhite cursor-pointer">+</p>
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
