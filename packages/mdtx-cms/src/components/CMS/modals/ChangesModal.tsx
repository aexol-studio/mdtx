import { useFileState } from '@/src/containers';
import { useState } from 'react';
import ReactDiffViewer, { ReactDiffViewerStylesOverride } from 'react-diff-viewer-continued';

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
        originalFile?: string;
        changedFile?: string;
    };
    handlePreviewChanges: (p: { originalFile?: string; changedFile?: string }) => void;
}

export const ChangesModal: React.FC<IChangesModal> = ({ previewChanges, handlePreviewChanges }) => {
    const { originalFiles, modifiedFiles } = useFileState();
    const [selectedFile, setSelectedFile] = useState<string>();
    return (
        <div className="w-full h-full flex overflow-hidden rounded-[0.4rem]">
            <div className="w-[25%] mx-[1.2rem] mt-[1.6rem]">
                {modifiedFiles.map(file => (
                    <div
                        onClick={() => {
                            setSelectedFile(file.name);
                            const found = originalFiles?.find(o => o.name === file.name);
                            if (found) {
                                handlePreviewChanges({
                                    changedFile: file.content,
                                    originalFile: found.content,
                                });
                            } else {
                                handlePreviewChanges({
                                    changedFile: file.content,
                                    originalFile: '',
                                });
                            }
                        }}
                        className="w-fit cursor-pointer">
                        <p
                            className={`${
                                selectedFile === file.name ? 'text-mdtxOrange0' : 'text-white'
                            } select-none text-[1.4rem]`}>
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
                    oldValue={previewChanges?.originalFile}
                    newValue={previewChanges?.changedFile}
                />
            </div>
        </div>
    );
};
