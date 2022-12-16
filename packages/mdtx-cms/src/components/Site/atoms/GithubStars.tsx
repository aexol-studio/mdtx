import { GithubStar } from '@/src/assets';

export const GithubStars: React.FC<{ stars?: number }> = ({ stars }) => (
  <div className="group h-fit w-fit select-none flex items-center border-landing-blue border-[1px] rounded-[10rem] px-[0.8rem] py-[0.2rem]">
    <div className="flex items-center justify-center">
      <GithubStar />
    </div>
    <p className="ml-[0.8rem] select-none text-[1.6rem] font-[600] text-landing-blue">
      {stars}
    </p>
    <p className="ml-[0.4rem] select-none text-[1.6rem] font-[400] text-landing-blue">
      Stars
    </p>
  </div>
);
