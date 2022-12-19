import { AddFileIcon } from '@/src/assets';
import React from 'react';

export const TitleInTree = () => {
  return (
    <div className="cursor-pointer ml-auto pr-[0.8rem] w-fit">
      <p
        className={`pl-[0.4rem] hover:underline text-[1.2rem] uppercase font-[600] text-white flex gap-[0.8rem]`}
      >
        <AddFileIcon /> Add File
      </p>
    </div>
  );
};
