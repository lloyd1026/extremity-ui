"use client"; // 客户端渲染

import { ReactNode, useState, useEffect} from 'react';
import Sidebar from '@/app/(dashboard)/components/Sidebar';
import UserHeader from '@/app/(dashboard)/components/AdminHeader';

import { useRouter } from 'next/navigation';
import AuthGuard from '@/utils/AuthGard';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 控制侧边栏展开/收起

  // 路由保护
  const router = useRouter();
  // 路由保护逻辑
  useEffect(() => {
    // 使用 AuthGuard 类来检查用户是否有有效的 token
    console.log("客户端路由保护");
    AuthGuard.checkAuth(router);
  }, [router]); // 当路由改变时重新运行

  // 切换侧边栏状态的函数
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // 通过后会正常渲染
  return (
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
  );
};

export default AdminLayout;