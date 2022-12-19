import { ICommand } from '@uiw/react-md-editor';
import { commandsType } from '../organisms/Editor';

export const CodeBlock = (commands: commandsType): ICommand => {
  return {
    ...commands.codeBlock,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 14.1667L18 10L14 5.83333M6 5.83333L2 10L6 14.1667M11.6 2L8 18"
          stroke="#E1E5EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };
};
