import { TextState, TextAreaTextApi } from '@uiw/react-md-editor';
import { utilsType } from '../organisms';

export const Bold = (utils: utilsType) => {
  return {
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
          d="M6 12.5H14C16.2091 12.5 18 10.7091 18 8.5C18 6.29086 16.2091 4.5 14 4.5H6V12.5ZM6 12.5H15C17.2091 12.5 19 14.2909 19 16.5C19 18.7091 17.2091 20.5 15 20.5H6V12.5Z"
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
        const state2 = api.replaceSelection(`**${state1.selectedText}**`);
        api.setSelectionRange({
          start: state2.selection.end - 2 - state1.selectedText?.length,
          end: state2.selection.end - 2,
        });
      }
    },
  };
};
