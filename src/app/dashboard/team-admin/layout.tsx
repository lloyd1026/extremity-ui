"use client"; // 客户端渲染

import { ReactNode, useState, useEffect} from 'react';
import Sidebar from '@/app/dashboard/components/team-admin/Sidebar2';
import UserHeader from '@/app/dashboard/components/team-admin/Header';

// import { AuthProvider } from '@/app/dashboard/components/auth/authcontext'; // 确保路径正确

interface TeamAdminLayoutProps {
  children: ReactNode;
}

const TeamAdminLayout = ({ children }: TeamAdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 控制侧边栏展开/收起

  // 切换侧边栏状态的函数
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // <AuthProvider>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <UserHeader isSidebarOpen={isSidebarOpen} />
        
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div
          className={`flex-1 p-4 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'ml-[260px]' : 'ml-[64px]'
          }`} // 根据 Sidebar 是否展开，调整主内容左边距
        >
          {children}
        </div>
      </div>
    // </AuthProvider>
  );
};

export default TeamAdminLayout;