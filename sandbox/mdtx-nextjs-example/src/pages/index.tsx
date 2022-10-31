import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { htmlContent } from '../mdtx';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

function HomePage() {
  const [value, setValue] = useState<string | undefined>(
    htmlContent['mdTestFile.md'].content,
  );

  useEffect(() => {
    setValue(htmlContent['mdTestFile.md'].content);
  }, [htmlContent]);

  return (
    <div className="relative w-screen h-screen">
      <div className="w-[2.4rem] h-[2.4rem] bg-red-900" onClick={() => {}} />
      <MDEditor data-color-mode="dark" value={value} onChange={setValue} />
    </div>
  );
}

export default HomePage;
