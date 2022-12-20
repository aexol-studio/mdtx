import { ICommand } from '@uiw/react-md-editor';
import { commandsType } from '../organisms/Editor';

export const Code = (commands: commandsType): ICommand => {
  return {
    ...commands.code,
    buttonProps: {
      ...commands.code.buttonProps,
      style: { padding: 0, margin: '0 0 0 1.6rem' },
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
          d="M13.2 15L18 10L13.2 5M6.8 5L2 10L6.8 15"
          stroke="#E1E5EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };
};
