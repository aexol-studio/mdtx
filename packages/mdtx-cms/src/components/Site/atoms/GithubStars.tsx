import { GithubStar } from '@/src/assets';
import React from 'react';

export const GithubStars: React.FC<{ stars?: number }> = ({ stars }) => {
  return (
    <div className="h-fit w-fit select-none flex items-center gap-[0.8rem] border-mdtxOrange0 border-[1px] rounded-[1.6rem] px-[0.8rem] py-[0.2rem]">
      <div className="mb-[0.2rem]">
        <GithubStar />
      </div>
      <p className="select-none text-[1.2rem] text-gray3">Star</p>
      <p className="select-none text-[1.2rem] text-gray3">{stars}</p>
    </div>
  );
};
