"use client"; // 客户端渲染

import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const TeamAdmin2Layout = ({ children }: AdminLayoutProps) => {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
};

export default TeamAdmin2Layout;