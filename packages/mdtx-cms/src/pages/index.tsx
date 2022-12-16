import React from 'react';
import { Layout } from '@/src/layouts';
import { HeroSection } from '@/src/components/Site';

const index = () => {
  return (
    <Layout pageTitle="MDtx - editor to fast edit your markdowns!">
      <main className="w-full flex flex-col justify-center items-center">
        <HeroSection />
      </main>
    </Layout>
  );
};

export default index;
