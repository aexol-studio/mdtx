import type { NextPage } from 'next';
import { htmlContent } from '../mdtx';

const Home: NextPage = () => {
  return (
    <div className="my-[1.6rem] container w-full xl:max-w-[1168px] mx-auto">
      <div className="bg-blue-200 xl:rounded-[2.4rem] py-[1.6rem] px-[3.2rem]">
        <p className="font-bold text-[2.4rem] text-center">
          {htmlContent['mdTestFile.md'].data.title}
        </p>
        <p className="font-normal text-[1.6rem] text-left">
          {htmlContent['mdTestFile.md'].data.link}
        </p>
        <div
          className="mt-[1.6rem] prose md:prose-lg lg:prose-xl"
          dangerouslySetInnerHTML={{
            __html: htmlContent['mdTestFile.md'].content,
          }}
        />
      </div>
    </div>
  );
};

export default Home;
