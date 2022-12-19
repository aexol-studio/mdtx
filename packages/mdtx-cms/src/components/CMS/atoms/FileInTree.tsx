import { FileIcon } from '@/src/assets';
import { TreeObject } from '@/src/utils';
import React, { PropsWithChildren } from 'react';

export const FileInTree: React.FC<
  PropsWithChildren<{
    tree: TreeObject;
    edited: boolean;
  }>
> = ({ edited, children }) => {
  return (
    <>
      <div className="w-fit flex items-center justify-center">
        <FileIcon edited={edited} />
      </div>
      {children}
    </>
  );
};
