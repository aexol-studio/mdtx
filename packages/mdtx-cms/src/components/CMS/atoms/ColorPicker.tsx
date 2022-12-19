import { TextAreaTextApi, TextState } from '@uiw/react-md-editor';
import React, { useEffect, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { utilsType } from '..';
import { Button } from './Button';

export const ColorPicker: React.FC<{
  color: string;
  onChange: (p: string) => void;
  getState: (() => false | TextState) | undefined;
  textApi?: TextAreaTextApi;
  utils: utilsType;
  close: () => void;
}> = ({ color, onChange, getState, textApi, utils, close }) => {
  const [value, setValue] = useState(color);
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(value);
    }, 50);
    return clearTimeout(timer);
  }, [value]);
  return (
    <>
      <HexColorPicker
        style={{ width: '14rem', height: '14rem' }}
        color={value}
        onChange={setValue}
      />
      <HexColorInput
        style={{ height: '2.4rem' }}
        color={value}
        onChange={setValue}
        placeholder="Type a color"
        prefixed
        alpha
      />
      <div className="mb-[0.4rem]">
        <Button
          onClick={() => {
            if (getState) {
              const state = getState();
              if (utils && textApi && state) {
                const newSelectionRange = utils.selectWord({
                  text: state.text,
                  selection: state.selection,
                });
                const state1 = textApi.setSelectionRange(newSelectionRange);
                const state2 = textApi.replaceSelection(
                  `${state1.selectedText}\n<!--rehype:style=color: ${value};-->`,
                );
                textApi.setSelectionRange({
                  start: state2.selection.end - 36 - state1.selectedText.length,
                  end: state2.selection.end - 36,
                });
              }
              close();
            }
          }}
          text="Apply"
          color="white"
        />
      </div>
    </>
  );
};
