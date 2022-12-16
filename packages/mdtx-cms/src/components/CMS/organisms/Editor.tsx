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
    console.log(pickedFilePath);
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
      padding: 0.9rem 0;
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
      margin: 0 1.6rem 0 1.6rem !important;
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
        extraCommands={[
          commands.group([], {
            name: 'UserHolder',
            groupName: 'UserHolder',
            buttonProps: {
              'aria-label': 'Insert title',
              style: { padding: 0 },
            },
            children: ({ close, getState, textApi }) => <div></div>,
            icon: (
              <div className="py-[0.8rem] flex gap-[0.8rem] bg-transparent items-center mr-[1.6rem]">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="13"
                    cy="13"
                    r="12"
                    fill="#11111D"
                    stroke="#E1E5EE"
                    strokeWidth="2"
                  />
                  <path
                    d="M13.0007 5.66699C13.8847 5.66699 14.7326 6.01818 15.3577 6.6433C15.9829 7.26842 16.334 8.11627 16.334 9.00033C16.334 9.88438 15.9829 10.7322 15.3577 11.3573C14.7326 11.9825 13.8847 12.3337 13.0007 12.3337C12.1166 12.3337 11.2688 11.9825 10.6437 11.3573C10.0185 10.7322 9.66734 9.88438 9.66734 9.00033C9.66734 8.11627 10.0185 7.26842 10.6437 6.6433C11.2688 6.01818 12.1166 5.66699 13.0007 5.66699ZM13.0007 14.0003C16.684 14.0003 19.6674 15.492 19.6674 17.3337V19.0003H6.33398V17.3337C6.33398 15.492 9.31733 14.0003 13.0007 14.0003Z"
                    fill="#E1E5EE"
                  />
                </svg>
                <p className="text-[1.6rem] leading-[1.8rem] font-[400] text-editor-light1">
                  User name
                </p>
              </div>
            ),
          }),
        ]}
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C2 14.4183 5.58172 18 10 18C11.3255 18 12.4 16.9255 12.4 15.6V15.2C12.4 14.8285 12.4 14.6427 12.4205 14.4867C12.5623 13.4098 13.4098 12.5623 14.4867 12.4205C14.6427 12.4 14.8285 12.4 15.2 12.4H15.6C16.9255 12.4 18 11.3255 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10Z"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 10.8C6.44183 10.8 6.8 10.4418 6.8 10C6.8 9.55817 6.44183 9.2 6 9.2C5.55817 9.2 5.2 9.55817 5.2 10C5.2 10.4418 5.55817 10.8 6 10.8Z"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.2 7.6C13.6418 7.6 14 7.24183 14 6.8C14 6.35817 13.6418 6 13.2 6C12.7582 6 12.4 6.35817 12.4 6.8C12.4 7.24183 12.7582 7.6 13.2 7.6Z"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.4 6.8C8.84183 6.8 9.2 6.44183 9.2 6C9.2 5.55817 8.84183 5.2 8.4 5.2C7.95817 5.2 7.6 5.55817 7.6 6C7.6 6.44183 7.95817 6.8 8.4 6.8Z"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          }),
          commands.divider,
          commands.group([], {
            name: 'Download file',
            keyCommand: 'Download file',
            buttonProps: { 'aria-label': 'Download file' },
            icon: (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.1765 10.4V5.84C16.1765 4.49587 16.1765 3.82381 15.9072 3.31042C15.6703 2.85883 15.2924 2.49168 14.8275 2.26158C14.299 2 13.6072 2 12.2235 2H6.95294C5.56928 2 4.87745 2 4.34896 2.26158C3.88409 2.49168 3.50614 2.85883 3.26928 3.31042C3 3.82381 3 4.49587 3 5.84V14.16C3 15.5041 3 16.1762 3.26928 16.6896C3.50614 17.1412 3.88409 17.5083 4.34896 17.7384C4.87745 18 5.56924 18 6.95282 18H10M12.0588 15.6L14.5294 18M14.5294 18L17 15.6M14.5294 18V13.2"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
