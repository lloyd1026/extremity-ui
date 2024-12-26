"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import request from "@/utils/request";
import config from '@/config/baseurl_config';

interface UserRole {
  idUser: number;
  email: string;
  idRole: number;
  roleName: string;
  createdTime: number;
  activated: number;
  avatarUrl: string;
  nickName: string;
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const PermissionsManage = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isActivatedFilter, setIsActivatedFilter] = useState<boolean>(false); // false: 未激活, true: 已激活
  const usersPerPage = 10;

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const endpoint = isActivatedFilter
        ? "admin/user/get-activate-role" // 已激活 API
        : "admin/user/get-deactivate-role"; // 未激活 API

      const response = await request.get(endpoint, {
        params: { idRole: 2 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const sortedData = response.data.data.sort(
          (a: UserRole, b: UserRole) => b.createdTime - a.createdTime
        );
        setUserRoles(sortedData);
      } else {
        setError("无法加载数据");
      }
    } catch (error) {
      console.error(error);
      setError("网络错误或服务器错误");
    } finally {
      setLoading(false);
    }
  };

  const toggleActivationStatus = async (
    userId: number,
    roleId: number,
    isActivated: number
  ) => {
    try {
      const endpoint =
        isActivated === 0
          ? "admin/user/activate-role"
          : "admin/user/deactivate-role";

      const result = await request.get(endpoint, {
        params: { idUser: userId, idRole: roleId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (result.data.success) {
        alert(result.data.message || "操作成功");
        fetchRoles();
      } else {
        alert(`操作失败: ${result.data.message || "未知错误"}`);
      }
    } catch (error) {
      console.error("操作失败:", error);
      alert("网络错误或服务器错误");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [isActivatedFilter]); // 监听激活状态的切换

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(userRoles.length / usersPerPage);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const currentPageData = userRoles.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div>
      {/* 左上角滑动按钮 */}
      <div className="flex justify-start items-center mb-4">
        <div className="relative">
          {/* 滑动开关 */}
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isActivatedFilter}
                onChange={() => setIsActivatedFilter(!isActivatedFilter)}
                className="sr-only" // 隐藏实际的 checkbox
              />
              {/* 开关背景 */}
              <div
                className={`block w-16 h-8 rounded-full transition-colors ${
                  isActivatedFilter ? "bg-purple-300" : "bg-gray-300"
                }`}
              ></div>
              {/* 滑块 */}
              <div
                className={`absolute top-0 left-0 w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-1000 ${
                  isActivatedFilter ? "translate-x-8" : "translate-x-0"
                }`}
              ></div>
            </div>
            {/* 标签 */}
            <span className="ml-3 text-sm text-gray-700">
              {isActivatedFilter ? "level 1" : "level 0"}
            </span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {currentPageData.map((user) => (
          <div
            key={user.idUser}
            className="flex items-center justify-between p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-300"
          >
            {/* 头像 */}
            <Image
              src={user?.avatarUrl ? `${config.imageUrl}${user.avatarUrl}` : "/images/default-avatar.jpg"}
              alt="用户头像"
              width={40}
              height={40}
              className="rounded-full"
            />

            {/* 用户信息 */}
            <div className="flex-1 ml-4">
              <p className="text-sm text-gray-800">
                <strong>昵称:</strong> {user.nickName}
              </p>
              <p className="text-sm text-gray-800">
                <strong>邮箱:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>创建时间:</strong> {formatTimestamp(user.createdTime)}
              </p>
            </div>

            {/* 标签和按钮 */}
            <div className="flex items-center space-x-2">
              {/* 标签 */}
              <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                {user.roleName}
              </span>
              <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                {user.activated === 0 ? "level 0" : "level 1"}
              </span>

              {/* 激活状态按钮 */}
              <button
                onClick={() =>
                  toggleActivationStatus(user.idUser, user.idRole, user.activated)
                }
                className={`px-3 py-1 text-sm rounded-md ${
                  user.activated === 0
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {user.activated === 0 ? "授权" : "取消授权"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 分页 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400 disabled:opacity-50"
        >
          上一页
        </button>
        <span className="px-4 py-2 text-gray-700">
          第 {currentPage} 页 / 共 {totalPages} 页
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400 disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
};

export default PermissionsManage;