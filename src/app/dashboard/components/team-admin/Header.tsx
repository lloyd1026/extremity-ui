"use client";
import { FaRegEnvelope, FaCog } from "react-icons/fa"; // 导入你需要的图标
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react"; // 用于控制下拉菜单显示
import LogoutButton from "@/app/dashboard/components/LogoutButton"; // 引入退出登录组件
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/dashboard/components/auth/authcontext";
import { userwithRoles } from "@/interfaces/userwithRoles";
import config from "@/config/baseurl_config";
import request from "@/utils/request";

interface AdminHeaderProps {
  isSidebarOpen: boolean; // 传递侧边栏展开状态
}

const UserHeader = ({ isSidebarOpen }: AdminHeaderProps) => {
  const router = useRouter(); // 控制页面跳转
  const { auth } = useAuth() as { auth: userwithRoles | null };
  const [isMounted, setIsMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 控制下拉菜单显示/隐藏
  const [hasUnread, setHasUnread] = useState(false); // 消息状态

  // 检查是否有未读消息
  const fetchUnread = async () => {
    try {
      const endpoints = [
        "team-admin/get-deactivated-team-members",
        "team-admin/get-deactivated-normal-users",
      ];

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          request.get(endpoint, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );

      // 检查是否有未处理的信息
      const hasPendingInfo = responses.some(
        (response) => response.data.success && response.data.data?.length > 0
      );
      setHasUnread(hasPendingInfo);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchUnread(); // 初始化时检查未读消息
  }, []);

  const handleNavigate = () => {
    router.push("/dashboard/personal-settings");
  };

  const avatar = () => {
    if (!isMounted || !auth) return "/images/default-avatar.jpg";
    return auth.avatarUrl && auth.avatarUrl.length !== 0
      ? config.imageUrl + auth.avatarUrl
      : "/images/default-avatar.jpg";
  };

  return (
    <header
      className={`flex justify-end items-center p-4 bg-gray-100 bg-opacity-70 shadow-lg border-b border-gray-300 rounded-lg transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "pl-[260px]" : "pl-[64px]"
      }`}
    >
      {/* 用户头像和按钮都放在右侧 */}
      <div className="flex items-center space-x-6">
        {/* 消息 */}
        <Link
          href="/dashboard/team-admin/users"
          className="relative flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-200 hover:text-indigo-600 transition-colors"
        >
          <FaRegEnvelope size={20} /> {/* 消息图标 */}
          {hasUnread && (
            <span
              className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"
              title="有未处理信息"
            />
          )}
          <span>消息</span>
        </Link>

        {/* 设置 */}
        <Link
          href="/dashboard/personal-settings"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-200 hover:text-indigo-600 transition-colors"
        >
          <FaCog size={20} /> {/* 设置图标 */}
          <span>设置</span>
        </Link>

        {/* 用户头像和名称 */}
        <div
          className="flex items-center space-x-2 relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <Image
            src={avatar()}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full border-2 border-gray-300 cursor-pointer"
          />
          <span>团队管理员</span>

          {/* 下拉菜单 */}
          {isDropdownOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50"
            >
              <Link
                href="/dashboard/login"
                className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded-lg"
              >
                账号切换
              </Link>
              <button
                onClick={handleNavigate}
                className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded-lg"
              >
                个人设置
              </button>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;