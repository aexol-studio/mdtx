import { useFileState } from '@/src/containers';
import dynamic from 'next/dynamic';
import React from 'react';
import ReactDiffViewer, {
  ReactDiffViewerStylesOverride,
} from 'react-diff-viewer-continued';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const newStyles: ReactDiffViewerStylesOverride = {
  variables: {
    dark: {
      diffViewerBackground: '#111111',
    },
  },
  emptyLine: {
    background: 'transparent',
  },
  contentText: {
    '&:hover': {
      color: '#FF9800',
    },
  },
};

interface IChangesModal {
  previewChanges?: {
    orginalFile: string;
    changedFile: string;
  };
  setPreviewChanges: React.Dispatch<
    React.SetStateAction<
      | {
          orginalFile: string;
          changedFile: string;
        }
      | undefined
    >
  >;
}

export const ChangesModal: React.FC<IChangesModal> = ({
  previewChanges,
  setPreviewChanges,
}) => {
  const { orginalFiles, modifiedFiles } = useFileState();

  return (
    <div className="w-full h-full flex">
      <div className="w-[25%] mx-[1.2rem] mt-[1.6rem]">
        {modifiedFiles.map((file) => (
          <div
            onClick={() => {
              const found = orginalFiles?.find((o) => o.name === file.name);
              if (found)
                setPreviewChanges({
                  changedFile: file.content,
                  orginalFile: found.content,
                });
            }}
            className="w-fit cursor-pointer"
          >
            <p className="select-none text-white text-[1.4rem]">
              {file.name.slice(file.name.indexOf('/') + 1)}
            </p>
          </div>
        ))}
      </div>
      <div className="max-h-[100%] overflow-y-scroll scrollbar w-full flex flex-1">
        <ReactDiffViewer
          styles={newStyles}
          useDarkTheme
          oldValue={previewChanges?.orginalFile}
          newValue={previewChanges?.changedFile}
          splitView={true}
        />
      </div>

      {/* <MDEditor
        value={previewChanges?.orginalFile}
        className="w-1/2 border-none rounded-none"
        height={'100%'}
        visibleDragbar={false}
        contentEditable="false"
        preview={'edit'}
        hideToolbar
      />
      <MDEditor
        style={{ border: 'none', borderRadius: 'none' }}
        value={previewChanges?.changedFile}
        className="w-1/2 h-full"
        height={'100%'}
        visibleDragbar={false}
        contentEditable="false"
        preview={'edit'}
        hideToolbar
      /> */}
    </div>
  );
};
