import React from 'react';
import { CustomHelmet } from '../components';

export const Layout: React.FC<{
  pageTitle?: string;
  children: React.ReactNode;
}> = ({ children, pageTitle }) => {
  return (
    <div className="w-screen h-screen flex">
      <CustomHelmet pageTitle={pageTitle} />
      {children}
    </div>
  );
};
