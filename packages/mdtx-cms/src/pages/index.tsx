import React from 'react';
import { Layout } from '@/src/layouts';
import { WhatIsMDtxContent } from '@/src/datas/WhatIsMDtxData';
import { HeroSection } from '@/src/components/Site';
import { WhatIsMDtx } from '@/src/components/Site';

const index = () => {
  return (
    <Layout pageTitle="MDtx - editor to fast edit your markdowns!">
      <main className="bg-mdtxBlack w-full h-full flex flex-col justify-center items-center">
        <HeroSection />
        <div className="mt-[1.6rem] mb-[12.8rem] max-w-[90%] mx-auto w-full xl:max-w-[1068px]">
          <section>
            <WhatIsMDtx
              content={WhatIsMDtxContent.content}
              image={WhatIsMDtxContent.image}
            />
          </section>
          {/* <section className="mt-[8rem] mb-[12rem] md:my-[12rem] w-full flex justify-center items-center">
            <BonusesOfMDtx
              bigTitle={BonusesOfMDtxContent.bigTitle}
              smallTitle={BonusesOfMDtxContent.smallTitle}
              sectionDescription={BonusesOfMDtxContent.sectionDescription}
              content={BonusesOfMDtxContent.content}
            />
          </section> */}
        </div>
      </main>
    </Layout>
  );
};

export default index;
