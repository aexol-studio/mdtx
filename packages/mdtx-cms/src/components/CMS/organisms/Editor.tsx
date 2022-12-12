import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useFileState } from '@/src/containers';
import { availableBranchType, RepositoryFromSearch } from '@/src/pages/editor';
import { TextAreaTextApi, TextState } from '@uiw/react-md-editor';
import { Code } from '../editor-functions';
import { Bold } from '../editor-functions/Bold';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

type commandsType = typeof import('@uiw/react-md-editor/lib/commands/index');
export type utilsType =
  typeof import('@uiw/react-md-editor/lib/utils/markdownUtils');

export const Editor: React.FC<{
  selectedRepository: RepositoryFromSearch | undefined;
  selectedBranch: availableBranchType | undefined;
  menuFnc: () => void;
}> = ({ selectedRepository, selectedBranch, menuFnc }) => {
  const { getSelectedFileByPath, setSelectedFileContentByPath } =
    useFileState();

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

  const headings = [
    {
      value: '# ',
      label: 'Heading 1',
      size: 22,
    },
    {
      value: '## ',
      label: 'Heading 2',
      size: 20,
    },
    {
      value: '### ',
      label: 'Heading 3',
      size: 20,
    },
    {
      value: '#### ',
      label: 'Heading 4',
      size: 18,
    },
    {
      value: '##### ',
      label: 'Heading 5',
      size: 16,
    },
    {
      value: '###### ',
      label: 'Heading 6',
      size: 14,
    },
  ];

  const Italic = {
    name: 'Bold',
    keyCommand: 'Bold',
    buttonProps: { 'aria-label': 'Insert bold' },
    icon: (
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 4.5H10M14 20.5H5M15 4.5L9 20.5"
          stroke="#E1E5EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    execute: (state: TextState, api: TextAreaTextApi) => {
      if (utils) {
        const newSelectionRange = utils.selectWord({
          text: state.text,
          selection: state.selection,
        });
        const state1 = api.setSelectionRange(newSelectionRange);
        const state2 = api.replaceSelection(`*${state1.selectedText}*`);
        api.setSelectionRange({
          start: state2.selection.end - 1 - state1.selectedText.length,
          end: state2.selection.end - 1,
        });
      }
    },
  };

  const Through = {
    name: 'Bold',
    keyCommand: 'Bold',
    buttonProps: { 'aria-label': 'Insert bold' },
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.5 9.50017H0.5C0.223844 9.50017 0 9.27633 0 9.00017V8.00017C0 7.72402 0.223844 7.50017 0.5 7.50017H15.5C15.7762 7.50017 16 7.72402 16 8.00017V9.00017C16 9.27633 15.7762 9.50017 15.5 9.50017ZM8.79169 10.0002C9.6435 10.4045 10.2456 10.8965 10.2456 11.7578C10.2456 12.7924 9.34003 13.4351 7.88241 13.4351C6.87225 13.4351 5.48009 13.0576 5.48009 12.0517V12.0002C5.48009 11.724 5.25622 11.5002 4.98009 11.5002H3.55469C3.27856 11.5002 3.05469 11.724 3.05469 12.0002V12.6003C3.05469 14.6892 5.48334 15.7822 7.88241 15.7822C10.6505 15.7822 12.9453 14.3622 12.9453 11.5814C12.9453 10.9622 12.8322 10.4434 12.6283 10.0002H8.79169ZM7.82444 7.00017C6.81125 6.57814 6.04831 6.09561 6.04831 5.13508C6.04831 4.07508 7.01397 3.65364 8.07837 3.65364C9.41109 3.65364 10.1084 4.17217 10.1084 4.68442V4.75017C10.1084 5.02633 10.3323 5.25017 10.6084 5.25017H12.0338C12.31 5.25017 12.5338 5.02633 12.5338 4.75017V3.80273C12.5338 2.16405 10.2924 1.30664 8.07837 1.30664C5.41578 1.30664 3.36819 2.58702 3.36819 5.23308C3.36819 5.94277 3.51397 6.51983 3.76747 7.00017H7.82444Z"
          fill="#E1E5EE"
        />
      </svg>
    ),
    execute: (state: TextState, api: TextAreaTextApi) => {
      if (utils) {
        const newSelectionRange = utils.selectWord({
          text: state.text,
          selection: state.selection,
        });
        const state1 = api.setSelectionRange(newSelectionRange);
        const state2 = api.replaceSelection(`~~${state1.selectedText}~~`);
        api.setSelectionRange({
          start: state2.selection.end - 2 - state1.selectedText.length,
          end: state2.selection.end - 2,
        });
      }
    },
  };

  const Quotes = {
    name: 'Quotes',
    keyCommand: 'Quotes',
    buttonProps: { 'aria-label': 'Insert quotes' },
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 3.44629V7.44629C16 11.7281 14.0655 13.9478 10.0012 15.0368C9.52546 15.1643 9.05834 14.8044 9.05834 14.3119V13.2527C9.05834 12.9384 9.25296 12.6548 9.54856 12.548C11.611 11.803 12.75 11.2605 12.75 8.94629H10.5C9.67156 8.94629 9 8.27473 9 7.44629V3.44629C9 2.61785 9.67156 1.94629 10.5 1.94629H14.5C15.3284 1.94629 16 2.61785 16 3.44629ZM5.5 1.94629H1.5C0.671562 1.94629 0 2.61785 0 3.44629V7.44629C0 8.27473 0.671562 8.94629 1.5 8.94629H3.75C3.75 11.2605 2.61096 11.803 0.548558 12.548C0.252964 12.6548 0.0583389 12.9384 0.0583389 13.2527V14.3119C0.0583389 14.8044 0.525464 15.1643 1.00125 15.0368C5.06546 13.9478 7 11.7281 7 7.44629V3.44629C7 2.61785 6.32844 1.94629 5.5 1.94629Z"
          fill="#E1E5EE"
        />
      </svg>
    ),
    execute: (state: TextState, api: TextAreaTextApi) => {
      if (utils) {
        const newSelectionRange = utils.selectWord({
          text: state.text,
          selection: state.selection,
        });
        const state1 = api.setSelectionRange(newSelectionRange);
        const breaksBeforeCount = utils.getBreaksNeededForEmptyLineBefore(
          state1.text,
          state1.selection.start,
        );
        const breaksBefore = Array(breaksBeforeCount + 1).join('\n');
        const breaksAfterCount = utils.getBreaksNeededForEmptyLineAfter(
          state1.text,
          state1.selection.end,
        );
        const breaksAfter = Array(breaksAfterCount + 1).join('\n');
        api.replaceSelection(
          `${breaksBefore}> ${state1.selectedText}${breaksAfter}`,
        );
        const selectionStart = state1.selection.start + breaksBeforeCount + 2;
        const selectionEnd = selectionStart + state1.selectedText.length;
        api.setSelectionRange({
          start: selectionStart,
          end: selectionEnd,
        });
      }
    },
  };

  const CodeBlock = {
    name: 'CodeBlock',
    keyCommand: 'CodeBlock',
    buttonProps: { 'aria-label': 'Insert CodeBlock' },
    icon: (
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 17.5L22 12.5L17 7.5M7 7.5L2 12.5L7 17.5M14 3.5L10 21.5"
          stroke="#E1E5EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    execute: (tate: TextState, api: TextAreaTextApi) => {
      if (utils) {
        const newSelectionRange = utils.selectWord({
          text: tate.text,
          selection: tate.selection,
        });
        const state1 = api.setSelectionRange(newSelectionRange);
        const breaksBeforeCount = utils.getBreaksNeededForEmptyLineBefore(
          state1.text,
          state1.selection.start,
        );
        const breaksBefore = Array(breaksBeforeCount + 1).join('\n');
        const breaksAfterCount = utils.getBreaksNeededForEmptyLineAfter(
          state1.text,
          state1.selection.end,
        );
        const breaksAfter = Array(breaksAfterCount + 1).join('\n');
        api.replaceSelection(
          `${breaksBefore}\`\`\`\n${state1.selectedText}\n\`\`\`${breaksAfter}`,
        );
        const selectionStart = state1.selection.start + breaksBeforeCount + 4;
        const selectionEnd = selectionStart + state1.selectedText.length;
        api.setSelectionRange({
          start: selectionStart,
          end: selectionEnd,
        });
      }
    },
  };

  const headingHandler = (
    heading: { value: string; label: string },
    getState: () => false | TextState,
    textApi: TextAreaTextApi,
  ) => {
    const state = getState();
    if (state !== false) {
      let modifyText = `${heading.value}${state.selectedText}\n`;
      if (!state.selectedText) {
        modifyText = `${heading.value}`;
      }
      textApi.replaceSelection(modifyText);
    }
  };
  const hardStyles = `
    .headingsButton:hover {
      background-color: transparent !important;
      color: inherit !important;
    }
    .headingsButton:outline {
      background-color: transparent !important;
      color: inherit !important;
    }
    .w-md-editor-toolbar {
      background-color: #232331 !important;
      display: flex;
      align-items: center;
      padding: 1.6rem 0;
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
      background-color: #8786A65C;
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
  `;
  return commands && utils ? (
    <>
      <style>{hardStyles}</style>
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
        commands={[
          commands.group([], {
            name: 'Headings',
            groupName: 'Headings',
            buttonProps: {
              className: 'headingsButton',
              'aria-label': 'Insert title',
              style: { padding: 0 },
            },
            children: ({ close, getState, textApi }) => (
              <div className="relative w-[20rem]">
                <div
                  className={`bg-editorBlack border-editorGray1 border-[1px] absolute top-[0.8rem] w-full flex flex-col items-center`}
                >
                  {headings.map((heading, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (getState && textApi) {
                          headingHandler(heading, getState, textApi);
                          close();
                        }
                      }}
                      className={`${
                        index !== 0 ? 'border-editorGray1 border-t-[1px]' : ''
                      } cursor-pointer hover:bg-editorGray0 w-full flex py-[0.4rem]`}
                    >
                      <p
                        style={{ fontSize: heading.size }}
                        className={`pl-[1.6rem] leading-[4rem] font-[700] text-mdtxWhitez`}
                      >
                        {heading.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ),
            icon: (
              <div className="hover:bg-[#FFFFFF20] transition-all duration-300 ease-in-out flex relative w-[20rem] items-center">
                <p className="pl-[0.8rem] text-[1.8rem] leading-[4rem] font-[700] text-mdtxWhite">
                  Headings
                </p>
              </div>
            ),
          }),
          commands.divider,
          commands.group([], Bold(utils)),
          commands.divider,
          commands.group([], Italic),
          commands.divider,
          commands.group([], Through),
          commands.divider,
          commands.group([], Quotes),
          commands.divider,
          commands.group([], Code(utils)),
          commands.divider,
          commands.group([], CodeBlock),
        ]}
      />
    </>
  ) : (
    <></>
  );
};
