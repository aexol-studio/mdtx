import '../styles/globals.css';
import '../styles/markdown-editor-preview.css';
import '../styles/markdown-editor.css';
import type { AppProps } from 'next/app';
import { Fira_Sans } from '@next/font/google';
import { AuthProvider, FileStateProvider, ToastsProvider } from '../containers';

const FiraSans = Fira_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastsProvider>
      <AuthProvider>
        <FileStateProvider>
          <style jsx global>{`
            html {
              font-family: ${FiraSans.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
        </FileStateProvider>
      </AuthProvider>
    </ToastsProvider>
  );
}

export default MyApp;
