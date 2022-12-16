import Link from 'next/link';
const LoginLink = `https://github.com/login/oauth/authorize?scope=repo%20read:user%20write:org%20read:org&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`;

export const HeroSection = () => (
  <header className="select-none relative items-center w-full flex flex-col">
    <div className="absolute top-[8rem] right-[14rem] rotate-[90deg] blur-[80px] opacity-[0.7]">
      <svg
        width="398"
        height="378"
        viewBox="0 0 398 378"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="mix-blend-overlay" opacity="0.7">
          <path
            d="M299.693 0.490812C369.035 -5.42646 418.78 65.9404 389.233 128.951L297.028 325.587C267.481 388.598 180.804 395.994 141.008 338.901L16.8191 160.731C-22.9766 103.637 13.9567 24.8739 83.299 18.9566L299.693 0.490812Z"
            fill="url(#paint0_linear_8_875)"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_8_875"
            x1="455.713"
            y1="-12.8231"
            x2="-46.6865"
            y2="337.362"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0A6AFD" />
            <stop offset="1" stopColor="#0A6AFD" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div className="absolute bottom-[-12rem] left-[5.2rem] rotate-[120deg] blur-[40px] opacity-[0.7]">
      <svg
        width="260"
        height="237"
        viewBox="0 0 260 237"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="mix-blend-overlay" opacity="0.7">
          <path
            d="M25.1245 171.388C-13.1877 143.055 -6.50708 83.8088 37.1496 64.746L173.388 5.2573C217.044 -13.8055 264.935 21.6118 259.59 69.0084L242.912 216.917C237.567 264.314 182.996 288.143 144.684 259.809L25.1245 171.388Z"
            fill="url(#paint0_linear_8_870)"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_8_870"
            x1="-61.0779"
            y1="107.637"
            x2="355.376"
            y2="154.597"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0A6AFD" />
            <stop offset="1" stopColor="#0A6AFD" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div className="flex justify-end relative pt-[20rem] max-w-[1024px] shadow-backgroundShadow bg-background w-full bg-no-repeat bg-cover flex-1 bg-center min-h-[calc(100vh-9.2rem)] pb-[9.6rem]">
      <div className="absolute left-[6.4rem]">
        <div className="relative w-fit">
          <h1 className="z-[2] relative font-ivymode whitespace-pre-wrap text-landing-text-black">{`MDTX:\nMarkdown transformer`}</h1>
          <div className="h-[1rem] bg-landing-yellow w-[30rem] absolute right-[0] bottom-[1.9rem] z-[1]"></div>
        </div>
        <p className="font-jostlight max-w-[35rem] text-[2.4rem] leading-[3.2rem] text-landing-text-black">
          Your markdown content anywhere you need it!
        </p>
      </div>
      <div className="relative h-[52rem] w-[26.8rem] bg-[#FFFFFF66] rounded-[1.6rem] mt-[-5.2rem] mr-[9rem] flex flex-col justify-end">
        <>
          <div className="w-[23.8rem] h-[10rem] bg-[#FFFFFF99] absolute top-[-2.4rem] rounded-[1.6rem] right-[-3.2rem] backdrop:blur-[2px] border-[1px] border-[#FFF]">
            <div className="flex justify-center items-center  w-full h-full relative">
              <div className="w-[0.8rem] h-[0.8rem] rounded-full bg-[#8F8F8F] absolute bottom-[-0.2rem] left-[0.2rem]" />

              <div className="absolute left-[-2.4rem] top-[50%] translate-y-[-50%] rotate-[8deg] rounded-[0.8rem] w-[5.2rem] h-[5.2rem] bg-[#FFFFFF]" />
              <div className="flex justify-center items-center absolute left-[-2rem] top-[45%] translate-y-[-50%] rounded-[0.8rem] w-[5.2rem] h-[5.2rem] bg-landing-blue">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path
                    d="M13 7.4408L11.8845 5.20971C11.5634 4.5676 11.4029 4.24653 11.1634 4.01196C10.9516 3.80453 10.6963 3.64677 10.4161 3.55011C10.0992 3.4408 9.74021 3.4408 9.02229 3.4408H5.2C4.0799 3.4408 3.51984 3.4408 3.09202 3.65878C2.71569 3.85053 2.40973 4.15649 2.21799 4.53281C2 4.96064 2 5.52069 2 6.6408V7.4408M2 7.4408H17.2C18.8802 7.4408 19.7202 7.4408 20.362 7.76778C20.9265 8.0554 21.3854 8.51434 21.673 9.07882C22 9.72056 22 10.5606 22 12.2408V16.6408C22 18.321 22 19.161 21.673 19.8028C21.3854 20.3673 20.9265 20.8262 20.362 21.1138C19.7202 21.4408 18.8802 21.4408 17.2 21.4408H6.8C5.11984 21.4408 4.27976 21.4408 3.63803 21.1138C3.07354 20.8262 2.6146 20.3673 2.32698 19.8028C2 19.161 2 18.321 2 16.6408V7.4408ZM15.5 17.9408L14 16.4408M15 13.9408C15 15.8738 13.433 17.4408 11.5 17.4408C9.567 17.4408 8 15.8738 8 13.9408C8 12.0078 9.567 10.4408 11.5 10.4408C13.433 10.4408 15 12.0078 15 13.9408Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="w-[80%] ml-[4.2rem] font-jost text-[1.4rem] font-[400] leading-[2rem] text-[#545454]">
                Log in to{' '}
                <Link
                  href={LoginLink}
                  className="font-jost text-[1.4rem] font-[600] leading-[2rem] text-landing-blue underline cursor-pointer"
                >
                  GitHub
                </Link>{' '}
                and find the repository you want to write some documentation or
                a readme for.
              </p>
            </div>
          </div>
        </>
        <>
          <div className="w-[18.2rem] h-[8rem] right-[-1.8rem] top-[10.8rem] absolute">
            <div className="relative w-full h-full">
              <div className="bg-[#0B0B0F] z-[2] relative rounded-[1.6rem] w-full h-full flex flex-col justify-center">
                <div className="w-[80%] mx-auto">
                  <p className="font-jost font-[300] text-[1.6rem] leading-[2.4rem] text-[#E1E5EE]">
                    Everything
                  </p>
                  <p className="font-ivymode text-[2rem] leading-[3.2rem] font-[700] text-[#E1E5EE]">
                    In one place!
                  </p>
                </div>
              </div>
              <div className="absolute top-0 z-[1] left-[-0.8rem] rotate-[-8deg] bg-[#FFFFFFCC] rounded-[1.6rem] w-full h-full" />
            </div>
          </div>
        </>
        <>
          <div className="absolute top-[24.6rem]">
            <div className="w-[85%] mx-auto relative">
              <div className="w-[0.8rem] h-[0.8rem] rounded-full bg-[#8F8F8F] absolute top-[-1.4rem]" />
              <p className="font-jost font-[400] text-[1.4rem] leading-[2rem] text-[#545454]">
                Write and style your text using Markdown in our simple and
                intuitive interface.
              </p>
            </div>
          </div>
        </>
        <div className="mb-[0.8rem] text-center self-center">
          <p className="uppercase font-ivymode text-[2.8rem] leading-[4rem] text-landing-text-black font-[700]">
            MDTX
          </p>
          <p className="font-jost font-[400] text-[1.4rem] leading-[2rem] text-[#545454]">
            Does it all for you
          </p>
        </div>
        <>
          <div className="min-w-[24.6rem] min-h-[16rem] absolute top-[30rem] rounded-[1.6rem] left-[-3rem] backdrop:blur-[2px]">
            <div className="w-full h-full relative">
              <ThirdBox />
              <div className="absolute right-[-1.2rem] top-[50%] translate-y-[-50%] rotate-[8deg] rounded-[0.8rem] w-[5.2rem] h-[5.2rem] bg-[#FFFFFFCC] border-[1px] border-[#FFFFFF]" />
              <div className="flex justify-center items-center absolute right-[-0.8rem] top-[55%] translate-y-[-50%] rounded-[0.8rem] w-[5.2rem] h-[5.2rem] bg-landing-blue">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.9995 18.4408L19.9994 19.5348C19.469 20.1149 18.7497 20.4408 17.9996 20.4408C17.2496 20.4408 16.5303 20.1149 15.9999 19.5348C15.4687 18.9559 14.7495 18.6308 13.9997 18.6308C13.2499 18.6308 12.5306 18.9559 11.9995 19.5348M2.99951 20.4408H4.67405C5.16324 20.4408 5.40783 20.4408 5.638 20.3855C5.84207 20.3365 6.03716 20.2557 6.21611 20.1461C6.41794 20.0224 6.59089 19.8494 6.9368 19.5035L19.4995 6.94078C20.328 6.11235 20.328 4.7692 19.4995 3.94078C18.6711 3.11235 17.328 3.11235 16.4995 3.94078L3.93677 16.5035C3.59087 16.8494 3.41792 17.0224 3.29423 17.2242C3.18457 17.4032 3.10377 17.5982 3.05477 17.8023C2.99951 18.0325 2.99951 18.2771 2.99951 18.7663V20.4408Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </>
        <>
          <div className="shadow-mdtxShadow1 absolute right-[56rem] bottom-[0.6rem] w-[25rem] h-[12rem] bg-[#FFFFFF99] rounded-[1.6rem] border-[1px] border-[#FFF] backdrop:blur-[5px]">
            <div className="relative w-full h-full flex flex-col">
              <div className="absolute left-[50%] translate-x-[-50%] top-[-4.2rem] rotate-[6deg] rounded-[0.8rem] w-[5.2rem] h-[5.2rem] bg-fullmoon border-[1px] border-white shadow-sm" />
              <div className="flex justify-center items-center absolute left-[48%] translate-x-[-50%] top-[-4.6rem] rounded-[0.8rem] w-[5.2rem] h-[5.2rem] bg-landing-blue shadow-sm">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 4.1908H6.91179C5.92403 4.1908 5.05178 4.83502 4.76129 5.7791L2.3495 13.6174C2.28354 13.8318 2.25 14.0548 2.25 14.2791V18.4408C2.25 19.6834 3.25736 20.6908 4.5 20.6908H19.5C20.7426 20.6908 21.75 19.6834 21.75 18.4408V14.2791C21.75 14.0548 21.7165 13.8318 21.6505 13.6174L19.2387 5.7791C18.9482 4.83502 18.076 4.1908 17.0882 4.1908H15M2.25 13.9408H6.10942C6.96166 13.9408 7.74075 14.4223 8.12188 15.1846L8.37812 15.697C8.75925 16.4593 9.53834 16.9408 10.3906 16.9408H13.6094C14.4617 16.9408 15.2408 16.4593 15.6219 15.697L15.8781 15.1846C16.2592 14.4223 17.0383 13.9408 17.8906 13.9408H21.75M12 3.4408V11.6908M12 11.6908L9 8.6908M12 11.6908L15 8.6908"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="w-[85%] mx-auto relative">
                <div className="w-[0.8rem] h-[0.8rem] rounded-full bg-[#8F8F8F] absolute top-[-0.2rem] right-[-0.4rem]" />
                <p className="font-jost font-[400] text-[1.4rem] leading-[2rem] text-landing-gray0 mt-[2.4rem]">
                  Commit or make a pull request and upload it directly to the
                  repository!
                </p>
              </div>
              <div className="flex items-center gap-[0.6rem] justify-center mt-[1.8rem]">
                <div className="border-t-[1px] border-[#E1E5EE] w-[8rem]" />
                <svg
                  width="127"
                  height="24"
                  viewBox="0 0 127 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 9H2M2 7.8L2 16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V7.8C22 6.11984 22 5.27977 21.673 4.63803C21.3854 4.07354 20.9265 3.6146 20.362 3.32698C19.7202 3 18.8802 3 17.2 3L6.8 3C5.11984 3 4.27976 3 3.63803 3.32698C3.07354 3.6146 2.6146 4.07354 2.32698 4.63803C2 5.27976 2 6.11984 2 7.8Z"
                    stroke="#D5DAE6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M92 9H72M72 7.8L72 16.2C72 17.8802 72 18.7202 72.327 19.362C72.6146 19.9265 73.0735 20.3854 73.638 20.673C74.2798 21 75.1198 21 76.8 21H87.2C88.8802 21 89.7202 21 90.362 20.673C90.9265 20.3854 91.3854 19.9265 91.673 19.362C92 18.7202 92 17.8802 92 16.2V7.8C92 6.11984 92 5.27977 91.673 4.63803C91.3854 4.07354 90.9265 3.6146 90.362 3.32698C89.7202 3 88.8802 3 87.2 3L76.8 3C75.1198 3 74.2798 3 73.638 3.32698C73.0735 3.6146 72.6146 4.07354 72.327 4.63803C72 5.27976 72 6.11984 72 7.8Z"
                    stroke="#D5DAE6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M57 12C57 16.4183 53.4183 20 49 20M57 12C57 7.58172 53.4183 4 49 4M57 12H41M49 20C44.5817 20 41 16.4183 41 12M49 20C51.001 17.8093 52.1388 14.9664 52.2006 12C52.1388 9.03363 51.001 6.19068 49 4M49 20C46.999 17.8093 45.8623 14.9664 45.8006 12C45.8623 9.03363 46.999 6.19068 49 4M41 12C41 7.58172 44.5817 4 49 4M43 20C43 21.1046 42.1046 22 41 22C39.8954 22 39 21.1046 39 20C39 18.8954 39.8954 18 41 18C42.1046 18 43 18.8954 43 20ZM59 20C59 21.1046 58.1046 22 57 22C55.8954 22 55 21.1046 55 20C55 18.8954 55.8954 18 57 18C58.1046 18 59 18.8954 59 20ZM43 4C43 5.10457 42.1046 6 41 6C39.8954 6 39 5.10457 39 4C39 2.89543 39.8954 2 41 2C42.1046 2 43 2.89543 43 4ZM59 4C59 5.10457 58.1046 6 57 6C55.8954 6 55 5.10457 55 4C55 2.89543 55.8954 2 57 2C58.1046 2 59 2.89543 59 4Z"
                    stroke="#D5DAE6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M115 17.5H115.01M111.2 22H118.8C119.92 22 120.48 22 120.908 21.782C121.284 21.5903 121.59 21.2843 121.782 20.908C122 20.4802 122 19.9201 122 18.8V5.2C122 4.07989 122 3.51984 121.782 3.09202C121.59 2.71569 121.284 2.40973 120.908 2.21799C120.48 2 119.92 2 118.8 2H111.2C110.08 2 109.52 2 109.092 2.21799C108.716 2.40973 108.41 2.71569 108.218 3.09202C108 3.51984 108 4.0799 108 5.2V18.8C108 19.9201 108 20.4802 108.218 20.908C108.41 21.2843 108.716 21.5903 109.092 21.782C109.52 22 110.08 22 111.2 22ZM115.5 17.5C115.5 17.7761 115.276 18 115 18C114.724 18 114.5 17.7761 114.5 17.5C114.5 17.2239 114.724 17 115 17C115.276 17 115.5 17.2239 115.5 17.5Z"
                    stroke="#D5DAE6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </>
        <>
          <div className="absolute left-[-31rem] bottom-[12.4rem]">
            <svg
              width="514"
              height="323"
              viewBox="0 0 514 323"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M379.971 1C331.187 44.8658 513 55.4847 513 103.405C513 151.325 156.669 179.26 142.465 213.031C128.261 246.801 278.703 239.981 273.548 282.613C268.392 325.246 62.6477 290.491 1 322"
                stroke="#8F8F8F"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </>
      </div>
    </div>
  </header>
);
const ThirdBox = () => {
  return (
    <svg
      width="246"
      height="159"
      viewBox="0 0 246 159"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_12_58)">
        <g filter="url(#filter1_b_12_58)">
          <rect
            x="10"
            y="17"
            width="206"
            height="118"
            rx="16"
            fill="white"
            fillOpacity="0.6"
          />
          <rect
            x="10.5"
            y="17.5"
            width="205"
            height="117"
            rx="15.5"
            stroke="white"
          />
        </g>
        <path
          d="M40 66.9408H189C197.56 66.9408 204.5 73.8804 204.5 82.4408V119.441C204.5 128.001 197.56 134.941 189 134.941H40C31.4396 134.941 24.5 128.001 24.5 119.441V82.4408C24.5 73.8804 31.4396 66.9408 40 66.9408Z"
          fill="white"
          stroke="white"
        />
        <path
          d="M186.25 41.3408C186.25 41.8408 186.433 42.2741 186.8 42.6408C187.167 43.0075 187.6 43.1908 188.1 43.1908C188.633 43.1908 189.067 43.0075 189.4 42.6408C189.767 42.2741 189.95 41.8408 189.95 41.3408C189.95 40.8075 189.767 40.3575 189.4 39.9908C189.067 39.6241 188.633 39.4408 188.1 39.4408C187.6 39.4408 187.167 39.6241 186.8 39.9908C186.433 40.3575 186.25 40.8075 186.25 41.3408Z"
          fill="#D5DAE5"
        />
        <path
          d="M192.85 41.3408C192.85 41.8408 193.033 42.2741 193.4 42.6408C193.767 43.0075 194.2 43.1908 194.7 43.1908C195.233 43.1908 195.667 43.0075 196 42.6408C196.367 42.2741 196.55 41.8408 196.55 41.3408C196.55 40.8075 196.367 40.3575 196 39.9908C195.667 39.6241 195.233 39.4408 194.7 39.4408C194.2 39.4408 193.767 39.6241 193.4 39.9908C193.033 40.3575 192.85 40.8075 192.85 41.3408Z"
          fill="#D5DAE5"
        />
        <path
          d="M199.5 41.3408C199.5 41.8408 199.683 42.2741 200.05 42.6408C200.417 43.0075 200.85 43.1908 201.35 43.1908C201.883 43.1908 202.317 43.0075 202.65 42.6408C203.017 42.2741 203.2 41.8408 203.2 41.3408C203.2 40.8075 203.017 40.3575 202.65 39.9908C202.317 39.6241 201.883 39.4408 201.35 39.4408C200.85 39.4408 200.417 39.6241 200.05 39.9908C199.683 40.3575 199.5 40.8075 199.5 41.3408Z"
          fill="#D5DAE5"
        />
        <rect
          x="24.5"
          y="30.9408"
          width="21"
          height="21"
          rx="3.5"
          fill="white"
          stroke="white"
        />
        <path
          d="M38.5248 41.0624C39.576 40.4831 40.2016 39.3699 40.2016 38.072C40.2016 36.5646 39.3813 35.3337 38.057 34.8164C37.2856 34.5036 36.5265 34.4408 35.5519 34.4408H29.75C29.4738 34.4408 29.25 34.6646 29.25 34.9408V35.9736C29.25 36.2497 29.4738 36.4736 29.75 36.4736H30.7848V46.4276H29.75C29.4738 46.4276 29.25 46.6515 29.25 46.9276V47.9408C29.25 48.217 29.4738 48.4408 29.75 48.4408H35.8653C36.6217 48.4408 37.2664 48.4005 37.9549 48.2038C39.5475 47.7281 40.75 46.2735 40.75 44.3787C40.75 42.7485 39.9196 41.5136 38.5248 41.0624V41.0624ZM33.4443 36.5911H35.5519C36.0611 36.5911 36.4124 36.6542 36.7246 36.801C37.2192 37.066 37.5029 37.6292 37.5029 38.3462C37.5029 39.4408 36.8679 40.1209 35.8457 40.1209H33.4443V36.5911V36.5911ZM36.9643 46.1372C36.6475 46.2639 36.2557 46.2905 35.9828 46.2905H33.4443V42.2515H36.0807C37.3197 42.2515 38.0513 43.0446 38.0513 44.222C38.0513 45.1103 37.6244 45.8621 36.9643 46.1372V46.1372Z"
          fill="#D5DAE5"
        />
        <rect
          x="50.5"
          y="30.9408"
          width="21"
          height="21"
          rx="3.5"
          fill="white"
          stroke="white"
        />
        <path
          d="M62.3978 46.4408H61.34L63.2804 36.4408H64.5531C64.6691 36.4408 64.7815 36.4005 64.871 36.3267C64.9605 36.253 65.0216 36.1504 65.0438 36.0365L65.2389 35.0365C65.2991 34.7278 65.0627 34.4408 64.7481 34.4408H59.7565C59.6405 34.4408 59.5281 34.4811 59.4386 34.5549C59.349 34.6286 59.2879 34.7312 59.2657 34.8451L59.0707 35.8451C59.0104 36.1538 59.2468 36.4408 59.5614 36.4408H60.6191L58.6788 46.4408H57.4453C57.3293 46.4408 57.2169 46.4811 57.1274 46.5549C57.0379 46.6286 56.9768 46.7312 56.9546 46.845L56.7594 47.845C56.6992 48.1538 56.9356 48.4408 57.2502 48.4408H62.2027C62.3186 48.4408 62.431 48.4005 62.5206 48.3267C62.6101 48.253 62.6712 48.1504 62.6934 48.0366L62.8886 47.0366C62.9488 46.7278 62.7124 46.4408 62.3978 46.4408Z"
          fill="#D5DAE5"
        />
        <rect
          x="76.5"
          y="30.9408"
          width="21"
          height="21"
          rx="3.5"
          fill="white"
          stroke="white"
        />
        <path
          d="M94.5 42.441H79.5C79.2238 42.441 79 42.2171 79 41.941V40.941C79 40.6648 79.2238 40.441 79.5 40.441H94.5C94.7762 40.441 95 40.6648 95 40.941V41.941C95 42.2171 94.7762 42.441 94.5 42.441ZM87.7917 42.941C88.6435 43.3452 89.2456 43.8373 89.2456 44.6986C89.2456 45.7332 88.34 46.3759 86.8824 46.3759C85.8722 46.3759 84.4801 45.9984 84.4801 44.9925V44.941C84.4801 44.6648 84.2562 44.441 83.9801 44.441H82.5547C82.2786 44.441 82.0547 44.6648 82.0547 44.941V45.5411C82.0547 47.63 84.4833 48.723 86.8824 48.723C89.6505 48.723 91.9453 47.303 91.9453 44.5222C91.9453 43.903 91.8322 43.3842 91.6283 42.941H87.7917ZM86.8244 39.941C85.8113 39.5189 85.0483 39.0364 85.0483 38.0759C85.0483 37.0159 86.014 36.5944 87.0784 36.5944C88.4111 36.5944 89.1084 37.113 89.1084 37.6252V37.691C89.1084 37.9671 89.3323 38.191 89.6084 38.191H91.0338C91.31 38.191 91.5338 37.9671 91.5338 37.691V36.7435C91.5338 35.1048 89.2924 34.2474 87.0784 34.2474C84.4158 34.2474 82.3682 35.5278 82.3682 38.1739C82.3682 38.8836 82.514 39.4606 82.7675 39.941H86.8244Z"
          fill="#D5DAE5"
        />
        <rect
          x="102.5"
          y="30.9408"
          width="21"
          height="21"
          rx="3.5"
          fill="white"
          stroke="white"
        />
        <g clip-path="url(#clip0_12_58)">
          <path
            d="M115.208 39.0449C117.075 40.8866 117.049 43.8392 115.219 45.6526C115.216 45.6563 115.211 45.6603 115.208 45.664L113.108 47.7333C111.255 49.5583 108.241 49.5581 106.389 47.7333C104.537 45.9085 104.537 42.9389 106.389 41.1142L107.549 39.9716C107.857 39.6686 108.386 39.87 108.402 40.2982C108.422 40.8439 108.522 41.3921 108.705 41.9216C108.767 42.1008 108.723 42.2991 108.587 42.4331L108.178 42.8361C107.302 43.699 107.274 45.1042 108.142 45.9756C109.017 46.8556 110.457 46.8609 111.34 45.9913L113.44 43.9224C114.321 43.0543 114.317 41.6513 113.44 40.7868C113.324 40.6731 113.208 40.5847 113.117 40.523C112.986 40.4347 112.905 40.2907 112.899 40.1348C112.887 39.8094 113.004 39.4741 113.265 39.217L113.923 38.5687C114.096 38.3987 114.366 38.3778 114.566 38.5154C114.795 38.673 115.01 38.8502 115.208 39.0449ZM112.406 35.1484L110.306 37.2176C110.302 37.2213 110.298 37.2253 110.295 37.229C108.622 38.9592 108.999 41.4895 110.704 43.559C110.878 43.7711 111.116 43.9309 111.345 44.0885C111.545 44.2261 111.816 44.2052 111.988 44.0352L112.646 43.3869C112.907 43.1298 113.024 42.7945 113.012 42.4691C113.006 42.3132 112.925 42.1692 112.795 42.0809C112.704 42.0192 112.587 41.9308 112.472 41.8171C111.594 40.9526 111.345 39.7435 112.074 38.9592L114.174 36.8903C115.057 36.0207 116.496 36.0259 117.372 36.906C118.24 37.7774 118.212 39.1826 117.336 40.0455L116.927 40.4485C116.791 40.5825 116.747 40.7808 116.809 40.96C116.992 41.4895 117.092 42.0377 117.112 42.5834C117.128 43.0116 117.657 43.213 117.965 42.91L119.125 41.7674C120.977 39.9427 120.977 36.9731 119.125 35.1484C117.272 33.3236 114.259 33.3233 112.406 35.1484Z"
            fill="#D5DAE5"
          />
        </g>
        <rect
          x="128.5"
          y="30.9408"
          width="21"
          height="21"
          rx="3.5"
          fill="white"
          stroke="white"
        />
        <path
          d="M147 36.3871V40.3871C147 44.6689 145.065 46.8886 141.001 47.9776C140.525 48.1051 140.058 47.7452 140.058 47.2527V46.1935C140.058 45.8792 140.253 45.5956 140.549 45.4888C142.611 44.7438 143.75 44.2013 143.75 41.8871H141.5C140.672 41.8871 140 41.2155 140 40.3871V36.3871C140 35.5586 140.672 34.8871 141.5 34.8871H145.5C146.328 34.8871 147 35.5586 147 36.3871ZM136.5 34.8871H132.5C131.672 34.8871 131 35.5586 131 36.3871V40.3871C131 41.2155 131.672 41.8871 132.5 41.8871H134.75C134.75 44.2013 133.611 44.7438 131.549 45.4888C131.253 45.5956 131.058 45.8792 131.058 46.1935V47.2527C131.058 47.7452 131.525 48.1051 132.001 47.9776C136.065 46.8886 138 44.6689 138 40.3871V36.3871C138 35.5586 137.328 34.8871 136.5 34.8871Z"
          fill="#D5DAE5"
        />
        <rect
          x="154.5"
          y="30.9408"
          width="21"
          height="21"
          rx="3.5"
          fill="white"
          stroke="white"
        />
        <g clip-path="url(#clip1_12_58)">
          <path
            d="M163.973 47.828L162.448 47.3855C162.288 47.3405 162.198 47.173 162.243 47.013L165.656 35.258C165.701 35.098 165.868 35.008 166.028 35.053L167.553 35.4955C167.713 35.5405 167.803 35.708 167.758 35.868L164.346 47.623C164.298 47.783 164.133 47.8755 163.973 47.828V47.828ZM161.123 45.023L162.211 43.863C162.326 43.7405 162.318 43.5455 162.191 43.433L159.926 41.4405L162.191 39.448C162.318 39.3355 162.328 39.1405 162.211 39.018L161.123 37.858C161.011 37.738 160.821 37.7305 160.698 37.8455L157.096 41.2205C156.968 41.338 156.968 41.5405 157.096 41.658L160.698 45.0355C160.821 45.1505 161.011 45.1455 161.123 45.023V45.023ZM169.303 45.038L172.906 41.6605C173.033 41.543 173.033 41.3405 172.906 41.223L169.303 37.843C169.183 37.7305 168.993 37.7355 168.878 37.8555L167.791 39.0155C167.676 39.138 167.683 39.333 167.811 39.4455L170.076 41.4405L167.811 43.433C167.683 43.5455 167.673 43.7405 167.791 43.863L168.878 45.023C168.991 45.1455 169.181 45.1505 169.303 45.038V45.038Z"
            fill="#D5DAE5"
          />
        </g>
        <rect
          x="37"
          y="102.441"
          width="25"
          height="3"
          rx="1.5"
          fill="#E1E5EE"
        />
        <rect
          x="37"
          y="88.4408"
          width="25"
          height="3"
          rx="1.5"
          fill="#D1D5DE"
        />
        <rect
          x="66"
          y="88.4408"
          width="25"
          height="3"
          rx="1.5"
          fill="#D1D5DE"
        />
        <rect
          x="70"
          y="102.441"
          width="25"
          height="3"
          rx="1.5"
          fill="#E1E5EE"
        />
        <rect
          x="100"
          y="102.441"
          width="94"
          height="3"
          rx="1.5"
          fill="#E1E5EE"
        />
        <rect
          x="100"
          y="126.441"
          width="94"
          height="3"
          rx="1.5"
          fill="#E1E5EE"
        />
        <rect
          x="37"
          y="114.441"
          width="78"
          height="3"
          rx="1.5"
          fill="#E1E5EE"
        />
        <rect
          x="37"
          y="126.441"
          width="20"
          height="3"
          rx="1.5"
          fill="#E1E5EE"
        />
        <rect
          x="62"
          y="126.441"
          width="33"
          height="3"
          rx="1.5"
          fill="#E1E5EE"
        />
        <rect
          x="121"
          y="114.441"
          width="73"
          height="3"
          rx="1.5"
          fill="#E1E5EE"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_12_58"
          x="0"
          y="0"
          width="246"
          height="158.441"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="10" dy="3" />
          <feGaussianBlur stdDeviation="10" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.133333 0 0 0 0 0.372549 0 0 0 0 0.545098 0 0 0 0.18 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_12_58"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_12_58"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_b_12_58"
          x="6"
          y="13"
          width="214"
          height="126"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_12_58"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_12_58"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_12_58">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(105 33.4408)"
          />
        </clipPath>
        <clipPath id="clip1_12_58">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(157 33.4408)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
