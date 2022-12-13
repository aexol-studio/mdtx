import { TextAreaTextApi, TextState } from '@uiw/react-md-editor/lib/commands';
import { utilsType } from '../organisms';

export const CodeBlock = (utils: utilsType) => {
  return {
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
};
