import { TextAreaTextApi, TextState } from '@uiw/react-md-editor/lib/commands';

const headings = [
  {
    value: '# ',
    label: 'Heading 1',
    size: 22,
  },
  {
    value: '## ',
    label: 'Heading 2',
    size: 20,
  },
  {
    value: '### ',
    label: 'Heading 3',
    size: 20,
  },
  {
    value: '#### ',
    label: 'Heading 4',
    size: 18,
  },
  {
    value: '##### ',
    label: 'Heading 5',
    size: 16,
  },
  {
    value: '###### ',
    label: 'Heading 6',
    size: 14,
  },
];

export const Headings = (
  close: () => void,
  getState?: (() => false | TextState) | undefined,
  textApi?: TextAreaTextApi | undefined,
) => {
  const headingHandler = (
    heading: { value: string; label: string },
    getState: () => false | TextState,
    textApi: TextAreaTextApi,
  ) => {
    const state = getState();
    if (state !== false) {
      let modifyText = `${heading.value}${state.selectedText}\n`;
      if (!state.selectedText) {
        modifyText = `${heading.value}`;
      }
      textApi.replaceSelection(modifyText);
    }
  };
  return (
    <div className="relative w-[20rem]">
      <div
        className={`bg-editorBlack border-editorGray1 border-[1px] absolute top-[0.8rem] w-full flex flex-col items-center`}
      >
        {headings.map((heading, index) => (
          <div
            key={index}
            onClick={() => {
              if (getState && textApi) {
                headingHandler(heading, getState, textApi);
                close();
              }
            }}
            className={`${
              index !== 0 ? 'border-editorGray1 border-t-[1px]' : ''
            } cursor-pointer hover:bg-editorGray0 w-full flex py-[0.4rem]`}
          >
            <p
              style={{ fontSize: heading.size }}
              className={`pl-[1.6rem] leading-[4rem] font-[700] text-mdtxWhitez`}
            >
              {heading.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
