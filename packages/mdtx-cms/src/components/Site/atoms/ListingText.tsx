import React from 'react';
import { PointArrow } from '@/src/assets';

export const ListingText: React.FC<{ title: string; text: string }> = ({
  title,
  text,
}) => {
  return (
    <div className="mt-[4rem] flex">
      <div className="min-w-[2.4rem] min-h-[2.4rem]">
        <PointArrow />
      </div>
      <div className="ml-[1.4rem]">
        <h2 className="font-[700] text-[2rem] leading-[2.4rem] text-gray2">
          {title}
        </h2>
        <p className="mt-[0.8rem] font-[400] text-[1.6rem] leading-[2.4rem] text-mediumGray">
          {text}
        </p>
      </div>
    </div>
  );
};
