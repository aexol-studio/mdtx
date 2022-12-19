import { ICommand } from '@uiw/react-md-editor';
import { commandsType } from '../organisms/Editor';

export const EditorInfo = (commands: commandsType): ICommand => {
  return commands.group([], {
    name: 'EditorInfo',
    buttonProps: {
      'aria-label': 'Get info about editor',
      title: 'Get info about editor',
    },
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_153_426)">
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
  });
};
