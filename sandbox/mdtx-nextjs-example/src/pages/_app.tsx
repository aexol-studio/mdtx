import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthConatiner } from '../../containers/AuthContainer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthConatiner.Provider>
      <Component {...pageProps} />
    </AuthConatiner.Provider>
  );
}

export default MyApp;
