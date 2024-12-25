"use client"; // 客户端渲染

import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
};

export default UserLayout;