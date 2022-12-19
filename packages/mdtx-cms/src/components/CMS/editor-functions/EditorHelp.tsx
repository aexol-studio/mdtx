import { ICommand } from '@uiw/react-md-editor';
import { commandsType } from '../organisms/Editor';

export const EditorHelp = (commands: commandsType): ICommand => {
  return commands.group([], {
    name: 'EditorHelp',
    buttonProps: {
      'aria-label': 'Get help about editor',
      title: 'Get help about editor',
      style: { marginRight: '0.4rem' },
    },
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_174_633)">
          <g clipPath="url(#clip1_174_633)">
            <path
              d="M7.381 7.3C7.59259 6.6985 8.01024 6.1913 8.55996 5.86822C9.10968 5.54514 9.75601 5.42704 10.3845 5.53484C11.0129 5.64264 11.5829 5.96937 11.9936 6.45718C12.4042 6.94498 12.629 7.56237 12.628 8.2C12.628 10 9.928 10.9 9.928 10.9M10 14.5H10.009M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
              stroke="#E1E5EE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_174_633">
            <rect width="20" height="20" fill="white" />
          </clipPath>
          <clipPath id="clip1_174_633">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  });
};
