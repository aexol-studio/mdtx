import { ICommand } from '@uiw/react-md-editor';
import { commandsType } from '../organisms/Editor';

const headings = (
  commands: commandsType,
): {
  command: ICommand;
}[] => [
  {
    command: { ...commands.title1 },
  },
  {
    command: { ...commands.title2 },
  },
  {
    command: { ...commands.title3 },
  },
  {
    command: { ...commands.title4 },
  },
  {
    command: { ...commands.title5 },
  },
  {
    command: { ...commands.title6 },
  },
];

export const Headings = (commands: commandsType): ICommand => {
  return commands.group(
    headings(commands).map((heading) => heading.command),
    {
      name: 'headings',
      groupName: 'headings',
      liProps: { id: 'headings' },
      buttonProps: {
        className: 'headingsButton',
        'aria-label': 'Open headings',
        title: 'Open headings',
      },
      icon: (
        <div className="hover:bg-[#FFFFFF20] py-[0.2rem] transition-all duration-300 ease-in-out flex relative w-[16rem] items-center justify-between">
          <p className="pl-[0.8rem] text-[1.8rem] leading-[1.8rem] font-[700] text-mdtxWhite">
            Headings
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
    },
  );
};
