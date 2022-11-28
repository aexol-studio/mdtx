import  { useState } from 'react';

export const Switcher: React.FC<{ handlingFunction: () => void }> = ({
  handlingFunction,
}) => {
  const [move, setMove] = useState(false);
  return (
    <div
      className="flex justify-center items-center relative w-[4.8rem] h-[2.4rem] rounded-[3.2rem] border-[2px] border-[#FFF]"
      onClick={() => {
        handlingFunction();
        setMove((prev) => !prev);
      }}
    >
      <div
        className={`${
          !move ? 'translate-x-[-70%]' : 'translate-x-[70%]'
        } transition-all ease-in-out duration-300 absolute bg-[#FFF] w-[1.6rem] h-[1.6rem] rounded-full`}
      />
    </div>
  );
};
