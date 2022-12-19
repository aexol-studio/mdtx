import '../styles/globals.css';
import '../styles/markdown-editor-preview.css';
import '../styles/markdown-editor.css';
import type { AppProps } from 'next/app';
import { Lato, Jost, Fira_Sans } from '@next/font/google';
import {
  AuthProvider,
  FileStateProvider,
  RepositoryStateProvider,
  ToastsProvider,
} from '../containers';
import localFont from '@next/font/local';
const LatoFont = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin-ext'],
});

const JostFont = Jost({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin-ext'],
});

const FiraSans = Fira_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin-ext'],
});

const IvyModeFont = localFont({
  src: '../../public/fonts/IvyMode-Bold.woff2',
});
const JostFontLight = localFont({
  src: '../../public/fonts/Jost-Light.ttf',
});
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <RepositoryStateProvider>
        <FileStateProvider>
          <ToastsProvider>
            <style jsx global>
              {`
                :root {
                  --lato-font: ${LatoFont.style.fontFamily};
                  --ivymode-font: ${IvyModeFont.style.fontFamily};
                  --jost-font: ${JostFont.style.fontFamily};
                  --jost-font-light: ${JostFontLight.style.fontFamily};
                  --fira-font: ${FiraSans.style.fontFamily};
                }
                html {
                  font-family: ${JostFont.style.fontFamily};
                }
              `}
            </style>
            <Component {...pageProps} />
          </ToastsProvider>
        </FileStateProvider>
      </RepositoryStateProvider>
    </AuthProvider>
  );
}

export default MyApp;
