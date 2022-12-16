import { TextState, TextAreaTextApi } from '@uiw/react-md-editor';
import { utilsType } from '../organisms';

export const Bold = (utils: utilsType) => {
  return {
    name: 'Bold',
    keyCommand: 'Bold',
    buttonProps: { 'aria-label': 'Insert bold' },
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 10H11.1538C12.8532 10 14.2308 8.433 14.2308 6.5C14.2308 4.567 12.8532 3 11.1538 3H5V10ZM5 10H11.9231C13.6224 10 15 11.567 15 13.5C15 15.433 13.6224 17 11.9231 17H5V10Z"
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
