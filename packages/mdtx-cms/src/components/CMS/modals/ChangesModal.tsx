import { useFileState } from '@/src/containers';
import { useState } from 'react';
import ReactDiffViewer, {
  ReactDiffViewerStylesOverride,
} from 'react-diff-viewer-continued';

const newStyles: ReactDiffViewerStylesOverride = {
  variables: {
    dark: {
      diffViewerBackground: '#111111',
      changedBackground: '#355347',
      addedBackground: '#355347',
      wordAddedBackground: '#355347',
    },
  },

  emptyLine: {
    background: 'transparent',
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
  const [selectedFile, setSelectedFile] = useState<string>();
  return (
    <div className="w-full h-full flex overflow-hidden rounded-[0.4rem]">
      <div className="w-[25%] mx-[1.2rem] mt-[1.6rem]">
        {modifiedFiles.map((file) => (
          <div
            onClick={() => {
              setSelectedFile(file.name);
              const found = orginalFiles?.find((o) => o.name === file.name);
              if (found) {
                setPreviewChanges({
                  changedFile: file.content,
                  orginalFile: found.content,
                });
              } else {
                setPreviewChanges({
                  changedFile: file.content,
                  orginalFile: '',
                });
              }
            }}
            className="w-fit cursor-pointer"
          >
            <p
              className={`${
                selectedFile === file.name ? 'text-mdtxOrange0' : 'text-white'
              } select-none text-[1.4rem]`}
            >
              {file.name.slice(file.name.indexOf('/') + 1)}
            </p>
          </div>
        ))}
      </div>
      <div className="max-h-[100%] overflow-y-scroll scrollbar w-full flex flex-1">
        <ReactDiffViewer
          splitView
          useDarkTheme
          styles={newStyles}
          oldValue={previewChanges?.orginalFile}
          newValue={previewChanges?.changedFile}
        />
      </div>
    </div>
  );
};
