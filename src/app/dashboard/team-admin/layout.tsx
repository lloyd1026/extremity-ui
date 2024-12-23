"use client"; // 客户端渲染

import { ReactNode } from "react";

interface TeamAdminLayoutProps {
  children: ReactNode;
}

const TeamAdminLayoutLayout = ({ children }: TeamAdminLayoutProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-60">
        {children}
    </div>
  );
};

export default TeamAdminLayoutLayout;