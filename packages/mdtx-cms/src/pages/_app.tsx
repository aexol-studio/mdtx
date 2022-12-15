import '../styles/globals.css';
import '../styles/markdown-editor-preview.css';
import '../styles/markdown-editor.css';
import type { AppProps } from 'next/app';
import { Lato } from '@next/font/google';
import { AuthProvider, FileStateProvider, ToastsProvider } from '../containers';

const LatoFont = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin-ext'],
});

const JostFont = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin-ext'],
});

const IvyModeFont = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin-ext'],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <FileStateProvider>
        <ToastsProvider>
          <style jsx global>{`
            html {
              font-family: ${LatoFont.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
        </ToastsProvider>
      </FileStateProvider>
    </AuthProvider>
  );
}

export default MyApp;
