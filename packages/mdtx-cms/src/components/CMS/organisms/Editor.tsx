import React from 'react';
import dynamic from 'next/dynamic';
import { useFileState } from '@/src/containers';
import { availableBranchType, RepositoryFromSearch } from '@/src/pages/editor';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
export const Editor: React.FC<{
  selectedRepository: RepositoryFromSearch | undefined;
  selectedBranch: availableBranchType | undefined;
}> = ({ selectedRepository, selectedBranch }) => {
  const { getSelectedFileByPath, setSelectedFileContentByPath } =
    useFileState();
  return (
    <MDEditor
      height={'100vh'}
      value={getSelectedFileByPath()?.content}
      previewOptions={{
        transformImageUri: (src) => {
          return !src.includes('https') || !src.includes('http')
            ? `https://github.com/${selectedRepository?.full_name}/blob/${selectedBranch?.name}/${src}?raw=true`
            : src;
        },
      }}
      onChange={(e) => {
        setSelectedFileContentByPath(e ? e : '');
      }}
    />
  );
};
