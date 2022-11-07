import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { AuthConatiner } from '../containers';
import { Layout } from '../layouts';

const index = () => {
  return (
    <Layout pageTitle="MDtx - editor to fast edit your markdowns!">
      <div className="bg-[#13131C] w-full h-full flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center bg-white px-[1.2rem] py-[1.6rem] rounded-[2.4rem]">
          <h1 className="text-[1.8rem] text-center text-black">
            Welcome to <span className="text-blue-200">MDtx</span> editor!
          </h1>
          <div className="w-[32rem] h-[32rem]">
            <Image
              src={
                'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
              }
              width="560"
              height="560"
              alt="GitHub Logo"
            />
          </div>
          <Link
            className="bg-[#13131C] text-white px-[1.2rem] py-[0.8rem] rounded-[2.4rem]"
            href={`/api/githublogin`}
          >
            Login with GitHub!
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default index;
