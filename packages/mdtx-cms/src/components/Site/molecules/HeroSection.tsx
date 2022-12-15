export const HeroSection = () => (
  <header className="select-none relative items-center w-full flex flex-col">
    <div className="max-w-[1024px] shadow-backgroundShadow bg-background w-full bg-no-repeat bg-contain flex-1 bg-center min-h-[calc(100vh-9.2rem)]">
      <div className="ml-[12.8rem] mt-[10.4rem]">
        <h1 className="whitespace-pre-wrap text-landing-text-black">{`MDTX:\nMarkdown transformer`}</h1>
        <p className="max-w-[35rem] font-[300] text-[2.4erm] leading-[3.2rem] text-landing-text-black">
          Your markdown content anywhere you need it!
        </p>
      </div>
    </div>
  </header>
);
