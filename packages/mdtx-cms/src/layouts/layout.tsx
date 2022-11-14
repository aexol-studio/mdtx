import React from 'react';
import { CustomHelmet } from '@/src/components';
import { Footer } from '@/src/components/Site/molecules/Footer';
import { NavigationBar } from '@/src/components/Site/molecules/NavigationBar';

export const Layout: React.FC<{
  pageTitle?: string;
  children: React.ReactNode;
  isEditor?: boolean;
}> = ({ children, pageTitle, isEditor }) => {
  return (
    <div
      className={`overflow-hidden max-w-screen min-h-screen flex ${
        !isEditor ? 'flex-col' : 'flex-row'
      }`}
    >
      <CustomHelmet isMainPage={!isEditor} pageTitle={pageTitle} />
      {!isEditor && <NavigationBar />}
      {children}
      {!isEditor && <Footer />}
    </div>
  );
};
