"use client"; // 客户端渲染

import { ReactNode } from "react";

interface TeamMemberLayoutProps {
  children: ReactNode;
}

const TeamMemberLayout = ({ children }: TeamMemberLayoutProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-60">
      <div className="text-2xl font-bold">用户信息展示</div>
      <div className="w-full max-w-5xl ">
        {children}
      </div>
    </div>
  );
};

export default TeamMemberLayout;