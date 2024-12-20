import { FaRegEnvelope, FaCog } from 'react-icons/fa'; // 导入你需要的图标
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react'; // 用于控制下拉菜单显示
import LogoutButton from '@/components/LogoutButton'; // 引入退出登录组件

interface AdminHeaderProps {
  isSidebarOpen: boolean; // 传递侧边栏展开状态
}

const UserHeader = ({ isSidebarOpen }: AdminHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 控制下拉菜单显示/隐藏

  return (
    <header
      className={`flex justify-end items-center p-4 bg-gray-100 bg-opacity-70 shadow-lg border-b border-gray-300 rounded-lg transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'pl-[260px]' : 'pl-[64px]' // 根据侧边栏是否展开调整内边距
      }`}
    >
      {/* 用户头像和按钮都放在右侧 */}
      <div className="flex items-center space-x-6">
        {/* 消息 */}
        <Link
          href="/messages"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-200 hover:text-indigo-600 transition-colors"
        >
          <FaRegEnvelope size={20} /> {/* 消息图标 */}
          <span>消息</span>
        </Link>

        {/* 设置 */}
        <Link
          href="/settings"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-200 hover:text-indigo-600 transition-colors"
        >
          <FaCog size={20} /> {/* 设置图标 */}
          <span>设置</span>
        </Link>

        {/* 用户头像和名称 */}
        <div
          className="flex items-center space-x-2 relative"
          onMouseEnter={() => setIsDropdownOpen(true)} // 鼠标悬停时显示下拉菜单
          onMouseLeave={() => setIsDropdownOpen(false)} // 鼠标离开时隐藏下拉菜单
        >
          <Image
            src="/images/default-avatar.jpg"
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full border-2 border-gray-300 cursor-pointer"
          />
          <span>超级管理员</span>

          {/* 下拉菜单 */}
          <div
            className={`absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg p-2 overflow-hidden ${
              isDropdownOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-10px] opacity-0'
            } transition-all duration-300 ease-in-out`}
          >
            <Link
              href="/login"
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded-lg"
            >
              账号切换
            </Link>
            <Link
              href="/personal-settings"
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded-lg"
            >
              个人设置
            </Link>
            {/* 退出登录按钮 */}
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;