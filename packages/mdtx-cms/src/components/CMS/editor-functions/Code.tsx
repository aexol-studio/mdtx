import { TextAreaTextApi, TextState } from '@uiw/react-md-editor/lib/commands';
import { utilsType } from '../organisms';

export const Code = (utils: utilsType) => {
  return {
    name: 'Code',
    keyCommand: 'Code',
    buttonProps: { 'aria-label': 'Insert code' },
    icon: (
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 18.5L22 12.5L16 6.5M8 6.5L2 12.5L8 18.5"
          stroke="#E1E5EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    execute: (tate: TextState, api: TextAreaTextApi) => {
      if (utils) {
        const newSelectionRange = utils.selectWord({
          text: tate.text,
          selection: tate.selection,
        });
        const state1 = api.setSelectionRange(newSelectionRange);
        if (state1.selectedText.indexOf('\n') === -1) {
          api.replaceSelection(`\`${state1.selectedText}\``);
          const selectionStart = state1.selection.start + 1;
          const selectionEnd = selectionStart + state1.selectedText.length;
          api.setSelectionRange({
            start: selectionStart,
            end: selectionEnd,
          });
          return;
        }
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
