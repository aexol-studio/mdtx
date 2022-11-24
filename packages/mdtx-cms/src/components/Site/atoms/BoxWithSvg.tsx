import { CirclesOne, CirclesTwo, CirclesThree } from '@/src/assets';

const ReturnBubbles = (typeOfBubbles: 'one' | 'two' | 'three') => {
  switch (typeOfBubbles) {
    case 'one':
      return (
        <div className="top-[-2.4rem] left-[50%] translate-x-[-50%] absolute">
          <CirclesOne />
        </div>
      );
    case 'two':
      return (
        <div className="top-[-0.8rem] left-[50%] translate-x-[-50%] absolute">
          <CirclesTwo />
        </div>
      );
    case 'three':
      return (
        <div className="top-[-1.2rem] left-[50%] translate-x-[-50%] absolute">
          <CirclesThree />
        </div>
      );
  }
};

export const BoxWithSvg: React.FC<{
  content: {
    typeOfBubbles: 'one' | 'two' | 'three';
    svg: JSX.Element;
    title: string;
    description: string;
  };
}> = ({ content }) => (
  <div className="select-none relative flex flex-col justify-center w-full max-w-[32.8rem]">
    {ReturnBubbles(content.typeOfBubbles)}
    <div className="rounded-[6px] bg-gradientOrange0 w-full min-h-[24.6rem] max-h-[24.6rem] md:min-h-[18.4rem] md:max-h-[18.4rem] flex justify-center items-center">
      {content.svg}
    </div>
    <div className="z-[1] w-[90%] mx-auto mt-[2.4rem] flex flex-col justify-center items-center">
      <h2 className="text-center font-[700] text-[2rem] leading-[2.4rem] text-gray2">
        {content.title}
      </h2>
      <p className="mt-[2.4rem] text-center font-[400] text-[1.6rem] leading-[2.4rem] text-mediumGray">
        {content.description}
      </p>
    </div>
  </div>
);
