import { Chevron, ContextDots, FolderIcon } from '@/src/assets';
import { TreeObject } from '@/src/utils';
import React, { PropsWithChildren } from 'react';

export const FolderInTree: React.FC<
  PropsWithChildren<{
    tree: TreeObject;
    path?: string;
    handleCreatingModal: () => void;
  }>
> = ({ tree, path, handleCreatingModal, children }) => {
  return (
    <>
      <div className="relative h-full w-fit flex items-center">
        <p className="cursor-pointer text-editor-purple2">
          <Chevron rotateIcon={path === tree.name} />
        </p>
      </div>
      <div className="w-fit flex items-center justify-center">
        <FolderIcon selected={path === tree.name} />
      </div>
      {children}
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleCreatingModal();
        }}
        className="z-[1] cursor-pointer text-white pr-[0.8rem]"
      >
        <ContextDots />
      </div>
    </>
  );
};
