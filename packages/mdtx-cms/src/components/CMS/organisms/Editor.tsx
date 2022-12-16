import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useFileState, useRepositoryState } from '@/src/containers';
import {
  Code,
  CodeBlock,
  Italic,
  Quotes,
  Through,
  Headings,
  Bold,
} from '../editor-functions';
import { ColorPicker } from '../atoms';
import { useGitHub } from '@/src/utils';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

type commandsType = typeof import('@uiw/react-md-editor/lib/commands/index');
export type utilsType =
  typeof import('@uiw/react-md-editor/lib/utils/markdownUtils');

export const Editor: React.FC = () => {
  const { getContents } = useGitHub();
  const [color, setColor] = useState('#ffffff');
  const { selectedRepository, selectedBranch } = useRepositoryState();
  const {
    getSelectedFileByPath,
    setSelectedFileContentByPath,
    pickedFilePath,
  } = useFileState();

  const [commands, setCommands] = useState<commandsType>();
  const [utils, setUtils] = useState<utilsType>();
  const loaderCommands = async () => {
    const commands = await import('@uiw/react-md-editor').then(
      (mod) => mod.commands,
    );
    const utils = await import('@uiw/react-md-editor').then(
      (mod) => mod.MarkdownUtil,
    );

    setUtils(utils);
    setCommands(commands);
  };

  useEffect(() => {
    loaderCommands();
  }, []);
  const handleDownload = (text: string) => {
    // const name = getSelectedFileByPath()?.name;
    if (!text) return;
    const file = new Blob([text], { type: 'text/plain' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = 'mdtx' + `-` + Date.now() + '.md';
    document.body.appendChild(element);
    element.click();
    if (element) {
      document.body.removeChild(element);
    }
  };
  const hardStyles = `
    .headingsButton {
      background-color: #11111D !important;
      border-radius: 0.8rem;
    }
    .headingsButton:hover {
      background-color: transparent !important;
      color: inherit !important;
    }
    .headingsButton:outline {
      background-color: transparent !important;
      color: inherit !important;
    }
    .w-md-editor-toolbar {
      background-color: #272839 !important;
      display: flex;
      align-items: center;
      padding: 0.7rem 0;
      border-bottom: 2px solid #11111D;
    }
    .w-md-editor-toolbar ul {
      display: flex;
      align-items: center;
    }
    .w-md-editor-toolbar li {
      margin-left: 1.6rem;
    }
    .w-md-editor-toolbar li > button {
      height: 100%;
    }
    .w-md-editor-toolbar li > button:active {
      background-color: transparent !important;
    }
    .w-md-editor-toolbar li > button:hover, .w-md-editor-toolbar li > button:focus {
      background-color: transparent !important;
    }
    .w-md-editor-toolbar-divider {
      height: 2.8rem;
      width: 1px;
      margin: 0 2.4rem 0 2.4rem !important;
      vertical-align: middle;
      background-color: rgba(132, 132, 161, 0.5);;
    }
    .w-md-editor-content {
      background-color: #1E1E2C !important;
    }
    .wmde-markdown-color {
      background-color: #1E1E2C !important;
    }
    .w-md-editor-preview {
      height: 100%;
      width: 40%;
    }
    .w-md-editor-input {
      height: 100%;
      width: 60%;
    }
    .small .react-colorful {
      width: 120px;
      height: 120px;
    }
    .small .react-colorful__hue {
      height: 20px;
    }
  `;

  const [privateImageUrl, setPrivateImageUrl] = useState('');
  return commands && utils ? (
    <>
      {!pickedFilePath && (
        <div className="fixed w-screen h-screen bg-[#13131C90] z-[99] flex justify-center items-center">
          <p className="text-white select-none">
            You need to select markdown file !
          </p>
        </div>
      )}
      <style>{hardStyles}</style>
      <MDEditor
        height={'100vh'}
        autoFocus
        value={getSelectedFileByPath()?.content}
        previewOptions={{
          transformImageUri: (src) => {
            if (selectedRepository?.private && selectedBranch) {
              const input = {
                owner: selectedRepository.full_name.split('/')[0],
                repo: selectedRepository.full_name.split('/')[1],
                path: src,
                ref: selectedBranch?.name,
              };
              getContents(input)
                .then((x) =>
                  setPrivateImageUrl(
                    ('download_url' in x && x.download_url) || '',
                  ),
                )
                .catch(() => {});
            }
            return selectedRepository?.private
              ? !src.includes('https') || !src.includes('http')
                ? privateImageUrl
                : src
              : !src.includes('https') || !src.includes('http')
              ? `https://github.com/${selectedRepository?.full_name}/blob/${selectedBranch?.name}/${src}?raw=true`
              : src;
          },
        }}
        onChange={(e) => {
          setSelectedFileContentByPath(e ? e : '');
        }}
        commands={[
          commands.group([], {
            name: 'Headings',
            groupName: 'Headings',
            buttonProps: {
              className: 'headingsButton',
              'aria-label': 'Insert title',
              style: { padding: 0 },
            },
            children: ({ close, getState, textApi }) =>
              Headings(close, getState, textApi),
            icon: (
              <div className="hover:bg-[#FFFFFF20] py-[0.8rem] transition-all duration-300 ease-in-out flex relative w-[16rem] items-center justify-between">
                <p className="pl-[0.8rem] text-[1.8rem] leading-[1.8rem] font-[700] text-mdtxWhite">
                  H1
                </p>
                <div className="mr-[0.8rem]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FAFAFE"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ),
          }),
          commands.divider,
          commands.group([], Bold(utils)),
          commands.divider,
          commands.group([], Italic(utils)),
          commands.divider,
          commands.group([], Through(utils)),
          commands.divider,
          commands.group([], Quotes(utils)),
          commands.divider,
          commands.group([], Code(utils)),
          commands.divider,
          commands.group([], CodeBlock(utils)),
          commands.divider,
          commands.group([], {
            name: 'Colors',
            groupName: 'Colors',
            buttonProps: {
              className: 'colorsButton',
              'aria-label': 'Insert title',
              style: { padding: 0 },
            },
            children: ({ close, execute, getState, textApi }) => {
              return (
                <div className="relative small flex flex-col gap-[1.6rem] px-[1.6rem] py-[0.4rem] items-center justify-center">
                  <ColorPicker
                    getState={getState}
                    textApi={textApi}
                    utils={utils}
                    color={color}
                    onChange={setColor}
                    close={close}
                  />
                </div>
              );
            },
            icon: (
              <div className="hover:bg-[#FFFFFF20] transition-all duration-300 ease-in-out flex relative items-center">
                <p className="text-[1.8rem] leading-[4rem] font-[700] text-mdtxWhite">
                  Color
                </p>
              </div>
            ),
          }),
          commands.divider,
          commands.group([], {
            name: 'Download file',
            keyCommand: 'Download file',
            buttonProps: { 'aria-label': 'Download file' },
            icon: (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 9L12 12L15 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 10V4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M20 17V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ),
            execute: (state, api) => {
              handleDownload(state.text);
            },
          }),
          commands.divider,
          commands.group([], {
            icon: undefined,
            children: ({ getState, textApi, close }) => {
              const { imageToAdd } = useFileState();
              return (
                <div
                  id="insert-menu-image"
                  onClick={() => {
                    if (getState) {
                      const state = getState();
                      if (utils && state) {
                        const newSelectionRange = utils.selectWord({
                          text: state.text,
                          selection: state.selection,
                        });
                        const state1 =
                          textApi?.setSelectionRange(newSelectionRange);
                        const state2 = textApi?.replaceSelection(
                          `![Alt](${imageToAdd?.slice(
                            imageToAdd.indexOf('/') + 1,
                          )})`,
                        );
                        textApi?.setSelectionRange({
                          start:
                            state2!.selection.end -
                            1 -
                            state1!.selectedText.length,
                          end: state2!.selection.end - 1,
                        });
                      }
                    }
                  }}
                >
                  x
                </div>
              );
            },
          }),
        ]}
      />
    </>
  ) : (
    <></>
  );
};
