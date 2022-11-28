import Image from 'next/image';
import { ListingText } from '@/src/components/Site/atoms';
export interface IWhatIsMDtx {
  image: string;
  content: {
    title: string;
    text: string;
  }[];
}

export const WhatIsMDtx: React.FC<IWhatIsMDtx> = ({ image, content }) => (
  <div className="w-full flex-col-reverse md:flex-row md:items-start items-center flex justify-between">
    <div className="select-none flex flex-col w-full md:w-1/2">
      <div className="w-[90%]">
        {content.map((item) => (
          <ListingText key={item.title} title={item.title} text={item.text} />
        ))}
      </div>
    </div>
    <div className="select-none flex items-start justify-start w-full md:w-1/2">
      <div className="relative md:ml-[3.2rem] w-[64rem] h-[24rem] md:h-[39rem] rounded-[6px]">
        <Image
          priority
          unoptimized
          src={image}
          alt="MDtx presentation"
          fill
          className="object-fill"
        />
      </div>
    </div>
  </div>
);
