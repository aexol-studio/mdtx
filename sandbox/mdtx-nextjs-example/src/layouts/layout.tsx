import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="w-screen h-screen flex">{children}</div>;
};
