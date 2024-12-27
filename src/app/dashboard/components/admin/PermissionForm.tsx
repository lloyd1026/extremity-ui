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
  permissions: number[]; // 权限数组
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
  const [searchTerm, setSearchTerm] = useState<string>(""); // 搜索框输入
  const usersPerPage = 10;

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await request.get("admin/user/get-activate-role", {
        params: { idRole: 2 },
      });

      if (response.data.success) {
        const sortedData = response.data.data.sort(
          (a: UserRole, b: UserRole) => b.createdTime - a.createdTime
        );

        const rolesWithPermissions = await Promise.all(
          sortedData.map(async (user: UserRole) => {
            const permResponse = await request.get("admin/team-admin/get-permissions", {
              params: { idUser: user.idUser },
            });

            return {
              ...user,
              permissions: permResponse.data.success ? permResponse.data.data || [] : [],
            };
          })
        );

        setUserRoles(rolesWithPermissions);
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

  useEffect(() => {
    fetchRoles();
  }, []);

  const togglePermission = async (idUser: number, permission: number, hasPermission: boolean) => {
    const action = hasPermission ? "移除" : "分配";
    const confirmMessage = `您确定要${action}此用户的权限吗？`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await request.get(
        hasPermission
          ? "admin/team-admin/deallocate-permission"
          : "admin/team-admin/allocate-permission",
        { params: { idUser, permission } }
      );

      if (response.data.success) {
        setUserRoles((prevRoles) =>
          prevRoles.map((user) =>
            user.idUser === idUser
              ? {
                  ...user,
                  permissions: hasPermission
                    ? user.permissions.filter((perm) => perm !== permission)
                    : [...user.permissions, permission],
                }
              : user
          )
        );
      } else {
        alert("操作失败，请稍后再试");
      }
    } catch (error) {
      console.error("请求失败:", error);
      alert("网络错误或服务器错误");
    }
  };

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

  const filteredUserRoles = userRoles.filter((user) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      user.nickName.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.idUser.toString().includes(lowerCaseSearchTerm) ||
      user.permissions.some((perm) => perm.toString().includes(lowerCaseSearchTerm))
    );
  });

  const currentPageData = filteredUserRoles.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜索用户 (昵称/邮箱/ID/权限)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="space-y-4">
        {currentPageData.map((user) => (
          <div
            key={user.idUser}
            className="flex items-center justify-between p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-300"
          >
            <Image
              src={user?.avatarUrl ? `${config.imageUrl}${user.avatarUrl}` : "/images/default-avatar.jpg"}
              alt="用户头像"
              width={40}
              height={40}
              className="rounded-full"
            />

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

            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { id: 1, label: "用户管理" },
                { id: 2, label: "成果管理" },
                { id: 3, label: "成果发布" },
              ].map((perm) => (
                <button
                  key={perm.id}
                  className={`px-4 py-2 text-sm rounded-md ${
                    user.permissions.includes(perm.id)
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => togglePermission(user.idUser, perm.id, user.permissions.includes(perm.id))}
                >
                  {perm.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

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