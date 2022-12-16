import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  useAuthState,
  useFileState,
  useRepositoryState,
} from '@/src/containers';
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
import Image from 'next/image';
import Link from 'next/link';
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
      min-height: 5.6rem;
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
          commands.divider,
          commands.group([], {
            name: '1',
            groupName: '1',
            buttonProps: {
              'aria-label': 'Insert title',
              style: { padding: 0 },
            },
            icon: (
              <svg
                className="mr-[0.8rem]"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.7333 2H6.26667C4.77319 2 4.02646 2 3.45603 2.29065C2.95426 2.54631 2.54631 2.95426 2.29065 3.45603C2 4.02646 2 4.77319 2 6.26667V13.7333C2 15.2268 2 15.9735 2.29065 16.544C2.54631 17.0457 2.95426 17.4537 3.45603 17.7094C4.02646 18 4.77319 18 6.26667 18H13.7333C15.2268 18 15.9735 18 16.544 17.7094C17.0457 17.4537 17.4537 17.0457 17.7094 16.544C18 15.9735 18 15.2268 18 13.7333V6.26667C18 4.77319 18 4.02646 17.7094 3.45603C17.4537 2.95426 17.0457 2.54631 16.544 2.29065C15.9735 2 15.2268 2 13.7333 2Z"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          }),
          commands.group([], {
            name: '2',
            groupName: '2',
            buttonProps: {
              'aria-label': 'Insert title',
              style: { padding: 0 },
            },
            icon: (
              <svg
                className="mr-[0.8rem]"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2V18M6.26667 2H13.7333C15.2268 2 15.9735 2 16.544 2.29065C17.0457 2.54631 17.4537 2.95426 17.7094 3.45603C18 4.02646 18 4.77319 18 6.26667V13.7333C18 15.2268 18 15.9735 17.7094 16.544C17.4537 17.0457 17.0457 17.4537 16.544 17.7094C15.9735 18 15.2268 18 13.7333 18H6.26667C4.77319 18 4.02646 18 3.45603 17.7094C2.95426 17.4537 2.54631 17.0457 2.29065 16.544C2 15.9735 2 15.2268 2 13.7333V6.26667C2 4.77319 2 4.02646 2.29065 3.45603C2.54631 2.95426 2.95426 2.54631 3.45603 2.29065C4.02646 2 4.77319 2 6.26667 2Z"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          }),
          commands.group([], {
            name: '3',
            groupName: '3',
            buttonProps: {
              'aria-label': 'Insert title',
              style: { padding: 0 },
            },
            icon: (
              <svg
                className="mr-[0.8rem]"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.33333 2V18M6.26667 2H13.7333C15.2268 2 15.9735 2 16.544 2.29065C17.0457 2.54631 17.4537 2.95426 17.7094 3.45603C18 4.02646 18 4.77319 18 6.26667V13.7333C18 15.2268 18 15.9735 17.7094 16.544C17.4537 17.0457 17.0457 17.4537 16.544 17.7094C15.9735 18 15.2268 18 13.7333 18H6.26667C4.77319 18 4.02646 18 3.45603 17.7094C2.95426 17.4537 2.54631 17.0457 2.29065 16.544C2 15.9735 2 15.2268 2 13.7333V6.26667C2 4.77319 2 4.02646 2.29065 3.45603C2.54631 2.95426 2.95426 2.54631 3.45603 2.29065C4.02646 2 4.77319 2 6.26667 2Z"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          }),
          commands.group([], {
            name: '4',
            groupName: '4',
            buttonProps: {
              'aria-label': 'Insert title',
              style: { padding: 0 },
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
                  d="M7.33333 2V18M6.26667 2H13.7333C15.2268 2 15.9735 2 16.544 2.29065C17.0457 2.54631 17.4537 2.95426 17.7094 3.45603C18 4.02646 18 4.77319 18 6.26667V13.7333C18 15.2268 18 15.9735 17.7094 16.544C17.4537 17.0457 17.0457 17.4537 16.544 17.7094C15.9735 18 15.2268 18 13.7333 18H6.26667C4.77319 18 4.02646 18 3.45603 17.7094C2.95426 17.4537 2.54631 17.0457 2.29065 16.544C2 15.9735 2 15.2268 2 13.7333V6.26667C2 4.77319 2 4.02646 2.29065 3.45603C2.54631 2.95426 2.95426 2.54631 3.45603 2.29065C4.02646 2 4.77319 2 6.26667 2Z"
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
            name: '5',
            groupName: '5',
            buttonProps: {
              'aria-label': 'Insert title',
              style: { padding: 0 },
            },
            icon: (
              <svg
                className="mr-[0.8rem]"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 8.99809C7 7.34107 8.34315 5.99779 10 5.99779C11.6569 5.99779 13 7.34107 13 8.99809C13 10.6551 11.6569 11.9984 10 11.9984V14.9928M9.98903 18H10.0261M6.99024 17.406C4.06358 16.2175 2 13.3474 2 9.99558C2 5.57974 5.58172 2 10 2C14.4183 2 18 5.57974 18 9.99558C18 13.3474 15.9364 16.2175 13.0098 17.406"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          }),
          commands.group([], {
            name: '6',
            groupName: '6',
            buttonProps: {
              'aria-label': 'Insert title',
              style: { padding: 0 },
            },
            icon: (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_153_426)">
                  <path
                    d="M10 18.0033V10M6.99024 17.4145C4.06358 16.2253 2 13.3536 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 13.3536 15.9364 16.2253 13.0098 17.4145M10 7.02344V7"
                    stroke="#E1E5EE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_153_426">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            ),
          }),
          commands.divider,
          commands.group([], {
            name: 'UserHolder',
            groupName: 'UserHolder',
            buttonProps: {
              'aria-label': 'UserHolder',
              style: { padding: 0 },
            },
            icon: <></>,
            render: () => {
              const { loggedData, logOut } = useAuthState();
              const [open, setOpen] = useState(false);
              const handleMenu = () => setOpen(!open);
              return (
                loggedData && (
                  <div
                    onClick={handleMenu}
                    className="z-[100] relative py-[0.8rem] bg-transparent mr-[1.6rem]"
                  >
                    <div className="cursor-pointer flex gap-[0.8rem] items-center">
                      <Image
                        loader={({ src }) => src}
                        priority
                        width={24}
                        height={24}
                        className="cursor-pointer rounded-full"
                        alt="User Logo"
                        src={loggedData.avatar_url}
                      />

                      <p className="text-[1.6rem] leading-[1.8rem] font-[400] text-editor-light1">
                        {loggedData.name ? loggedData.name : loggedData.login}
                      </p>
                    </div>
                    {open && (
                      <div className="absolute w-[calc(100%+0.4rem)] bg-editor-black1 border-editor-black3 border-b-[2px] border-l-[2px] border-r-[2px] rounded-bl-[0.8rem] rounded-br-[0.8rem] top-[4.2rem] shadow-xl">
                        <div className="mt-[0.8rem] px-[1.6rem]">
                          <Link
                            href={loggedData.html_url + '?tab=repositories'}
                            target={'_blank'}
                            className="hover:underline cursor-pointer w-fit text-[1.4rem] leading-[1.8rem] font-[400] text-editor-light1"
                          >
                            Go to GitHub
                          </Link>
                        </div>
                        <div className="mt-[0.8rem] mb-[1.6rem] px-[1.6rem]">
                          <p
                            onClick={logOut}
                            className="hover:underline cursor-pointer w-fit text-[1.4rem] leading-[1.8rem] font-[400] text-editor-light1"
                          >
                            Log out
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              );
            },
          }),
        ]}
        onChange={(e) => {
          !!pickedFilePath && setSelectedFileContentByPath(e ? e : '');
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
          commands.group([], Italic(utils)),
          commands.group([], Through(utils)),
          commands.divider,
          commands.group([], {
            name: 'a',
            groupName: 'a',
            buttonProps: {
              'aria-label': 'Insert title',
              style: { padding: 0 },
            },
            icon: (
              <svg
                className="mr-[0.8rem]"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.2222 12.6667L14.8889 10L12.2222 7.33333M7.77778 7.33333L5.11111 10L7.77778 12.6667M6.26667 18H13.7333C15.2268 18 15.9735 18 16.544 17.7094C17.0457 17.4537 17.4537 17.0457 17.7094 16.544C18 15.9735 18 15.2268 18 13.7333V6.26667C18 4.77319 18 4.02646 17.7094 3.45603C17.4537 2.95426 17.0457 2.54631 16.544 2.29065C15.9735 2 15.2268 2 13.7333 2H6.26667C4.77319 2 4.02646 2 3.45603 2.29065C2.95426 2.54631 2.54631 2.95426 2.29065 3.45603C2 4.02646 2 4.77319 2 6.26667V13.7333C2 15.2268 2 15.9735 2.29065 16.544C2.54631 17.0457 2.95426 17.4537 3.45603 17.7094C4.02646 18 4.77319 18 6.26667 18Z"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          }),
          commands.group([], {
            name: 'b',
            groupName: 'b',
            buttonProps: {
              'aria-label': 'Insert title',
              style: { padding: 0 },
            },
            icon: (
              <svg
                className="mr-[0.8rem]"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.89189 15.2C4.89189 15.5715 4.89189 15.7573 4.91131 15.9133C5.04543 16.9902 5.84709 17.8377 6.86583 17.9795C7.01336 18 7.18909 18 7.54054 18H13.3676C14.639 18 15.2748 18 15.7604 17.7384C16.1876 17.5083 16.5349 17.1412 16.7526 16.6896C17 16.1762 17 15.5041 17 14.16V8.39058C17 7.80356 17 7.51005 16.9373 7.23384C16.8817 6.98896 16.7899 6.75485 16.6655 6.54012C16.5251 6.29792 16.3287 6.09037 15.9361 5.67529L13.5234 3.12471C13.1307 2.70963 12.9344 2.50208 12.7053 2.35366C12.5022 2.22207 12.2807 2.1251 12.0491 2.06631C11.7878 2 11.5101 2 10.9549 2H7.54054C7.18909 2 7.01336 2 6.86583 2.02053C5.84709 2.16232 5.04543 3.00978 4.91131 4.08674C4.89189 4.2427 4.89189 4.42846 4.89189 4.8M7.91892 12L9.81081 10L7.91892 8M4.89189 8L3 10L4.89189 12"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          }),
          commands.group([], {
            name: 'c',
            groupName: 'c',
            buttonProps: {
              'aria-label': 'Insert title',
              style: { padding: 0 },
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
                  d="M6.4 6H6C3.79086 6 2 7.79086 2 10C2 12.2091 3.79086 14 6 14H7.6C9.80914 14 11.6 12.2091 11.6 10M13.6 14H14C16.2091 14 18 12.2091 18 10C18 7.79086 16.2091 6 14 6H12.4C10.1909 6 8.4 7.79086 8.4 10"
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
            name: 'd',
            groupName: 'd',
            buttonProps: {
              'aria-label': 'Insert title',
              style: { padding: 0 },
            },
            icon: (
              <svg
                className="mr-[0.8rem]"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 10L7.33333 10M18 4.85714L7.33333 4.85714M18 15.1429L7.33333 15.1429M3.77778 10C3.77778 10.4734 3.37981 10.8571 2.88889 10.8571C2.39797 10.8571 2 10.4734 2 10C2 9.52661 2.39797 9.14286 2.88889 9.14286C3.37981 9.14286 3.77778 9.52661 3.77778 10ZM3.77778 4.85714C3.77778 5.33053 3.37981 5.71429 2.88889 5.71429C2.39797 5.71429 2 5.33053 2 4.85714C2 4.38376 2.39797 4 2.88889 4C3.37981 4 3.77778 4.38376 3.77778 4.85714ZM3.77778 15.1429C3.77778 15.6162 3.37981 16 2.88889 16C2.39797 16 2 15.6162 2 15.1429C2 14.6695 2.39797 14.2857 2.88889 14.2857C3.37981 14.2857 3.77778 14.6695 3.77778 15.1429Z"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          }),
          commands.group([], Quotes(utils)),
          commands.divider,
          commands.group([], Code(utils)),
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
          // commands.divider,
          // commands.group([], {
          //   icon: undefined,
          //   children: ({ getState, textApi, close }) => {
          //     const { imageToAdd } = useFileState();
          //     return (
          //       <div
          //         id="insert-menu-image"
          //         onClick={() => {
          //           if (getState) {
          //             const state = getState();
          //             if (utils && state) {
          //               const newSelectionRange = utils.selectWord({
          //                 text: state.text,
          //                 selection: state.selection,
          //               });
          //               const state1 =
          //                 textApi?.setSelectionRange(newSelectionRange);
          //               const state2 = textApi?.replaceSelection(
          //                 `![Alt](${imageToAdd?.slice(
          //                   imageToAdd.indexOf('/') + 1,
          //                 )})`,
          //               );
          //               textApi?.setSelectionRange({
          //                 start:
          //                   state2!.selection.end -
          //                   1 -
          //                   state1!.selectedText.length,
          //                 end: state2!.selection.end - 1,
          //               });
          //             }
          //           }
          //         }}
          //       >
          //         x
          //       </div>
          //     );
          //   },
          // }),
        ]}
      />
    </>
  ) : (
    <></>
  );
};
