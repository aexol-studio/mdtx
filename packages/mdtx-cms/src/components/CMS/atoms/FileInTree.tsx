import { FileIcon } from '@/src/assets';
import { FileImageIcon, GIFIcon } from '@/src/assets/menu-icons';
import { TreeObject } from '@/src/utils';
import React, { PropsWithChildren } from 'react';

export const FileInTree: React.FC<
    PropsWithChildren<{
        tree: TreeObject;
        edited: boolean;
    }>
> = ({ edited, children, tree }) => {
    const onlyIMGRef = /(.*)\.(png|jpg|jpeg|gif|webp)$/;
    const onlyIMG = (p: string) => !!p.match(onlyIMGRef);
    return (
        <>
            <div className="relative h-full w-fit flex items-center min-w-[2rem] min-h-[2rem]" />
            <div className="w-fit flex items-center justify-center">
                {onlyIMG(tree.name) ? (
                    <>{tree.name.endsWith('.gif') ? <GIFIcon /> : <FileImageIcon />}</>
                ) : (
                    <FileIcon edited={edited} />
                )}
            </div>
            {children}
        </>
    );
};
