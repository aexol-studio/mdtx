import { FileIcon, FolderIcon } from '@/src/assets';
import { useFileState } from '@/src/containers';
import { TreeObject } from '@/src/utils/treeBuilder';
import React, { useState } from 'react';

export const RepositoryTree: React.FC<{
  tree?: TreeObject;
  root?: boolean;
  activePath?: string;
  activeFile?: TreeObject;
}> = ({ tree, root, activePath, activeFile }) => {
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
    <div className="mx-[0.8rem] my-[0.2rem]">
      {tree?.name && (
        <div
          onClick={() => {
            !(hasChildren && root) && clickHandler();
          }}
          className={`${
            hasChildren && root
              ? 'mb-[1.2rem] cursor-default'
              : 'items-center cursor-pointer'
          } flex gap-[0.4rem]`}
        >
          {hasChildren && root && (
            <div>
              <p className="text-white leading-[1.8rem] select-none text-center text-[1.2rem] font-[700] uppercase tracking-wider">
                Repository:&nbsp;
              </p>
            </div>
          )}
          {isFolder && (
            <div className="flex items-center justify-center">
              <FolderIcon selected={path === tree.name} />
            </div>
          )}
          {!hasChildren && (
            <div className="flex items-center justify-center">
              <FileIcon
                edited={!!modifiedFiles.find((x) => x.name === tree.path)}
                selected={tree.path === pickedFilePath}
              />
            </div>
          )}
          <div>
            <p
              className={`${
                hasChildren && root ? 'text-[1.2rem]' : 'text-[1.4rem]'
              } text-white`}
            >
              {tree?.name}
            </p>
          </div>
        </div>
      )}
      {hasChildren && (path === tree.name || root) && (
        <div className="ml-[0.4rem]">
          {tree.children?.map((v) => {
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
      )}
    </div>
  );
};
