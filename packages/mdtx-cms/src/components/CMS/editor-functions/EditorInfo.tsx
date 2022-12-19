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
        <g clipPath="url(#clip0_174_636)">
          <g clipPath="url(#clip1_174_636)">
            <path
              d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
              stroke="#E1E5EE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.0002 13.375V10M10 6.625H10.0068"
              stroke="#E1E5EE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_174_636">
            <rect width="20" height="20" fill="white" />
          </clipPath>
          <clipPath id="clip1_174_636">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  });
};
