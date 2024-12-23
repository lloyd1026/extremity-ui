"use client"; // 客户端渲染

import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-60">
      <div className="text-2xl font-bold mb-6">个人信息展示</div>
      <div className="w-full max-w-5xl ">
        {children}
      </div>
    </div>
  );
};

export default UserLayout;