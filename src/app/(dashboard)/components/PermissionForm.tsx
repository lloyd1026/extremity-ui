"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import request from "@/utils/request";
import RoleSelector from "@/app/(dashboard)/components/RoleSelector";

interface Role {
  idRole: number;
  name: string;
}

interface User {
  idUser: number;
  account: string;
  nickname: string;
  avatarUrl: string;
  roles?: string[]; // 用户角色
}

const PermissionsManage = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [roleList, setRoleList] = useState<Role[]>([]); // 系统中所有角色
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const usersPerPage = 10;

  // 获取系统中的所有角色
  const fetchRoles = async () => {
    try {
      const response = await request.get("admin/simple-roles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setRoleList(response.data.data);
      }
    } catch (error) {
      console.log("无法加载角色列表:", error);
    }
  };

  // 获取用户数据并加载角色
  const fetchUsersWithRoles = async (roleIds: string, page: number) => {
    setLoading(true);
    try {
      const response = await request.get("admin/user/get-by-role-ids", {
        params: { ids: roleIds },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success && Array.isArray(response.data.data[selectedRoleId])) {
        const users = response.data.data[selectedRoleId];
        setTotalUsers(users.length);

        // 分页处理
        const usersToShow = users.slice((page - 1) * usersPerPage, page * usersPerPage);

        // 加载角色
        const usersWithRoles = await Promise.all(
          usersToShow.map(async (user: User) => {
            const roles = await fetchUserRoles(user.idUser);
            return { ...user, roles };
          })
        );

        setUserList(usersWithRoles);
      } else {
        setUserList([]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("无法加载用户数据");
      setLoading(false);
    }
  };

  // 获取用户角色
  const fetchUserRoles = async (userId: number) => {
    try {
      const response = await request.get(`admin/user/${userId}/role`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        return response.data.data.map((role: { name: string }) => role.name);
      }
      return [];
    } catch (error) {
      console.log(`无法加载用户 ${userId} 的角色:`, error);
      return [];
    }
  };

  // 增加或删除角色
  const toggleUserRole = async (userId: number, roleId: number, hasRole: boolean) => {
    try {
      let result;
      if (hasRole) {
        result = await request.get("admin/user/revoke-role", {
          params: { idUser: userId, idRole: roleId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        result = await request.get("admin/user/grant-role", {
          params: { idUser: userId, idRole: roleId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
  
      if (result.data.success) {
        alert(`role operate success: ${hasRole ? "revoke role" : "add role"}`);
        if(result.data.message){
          alert(result.data.message);
        }
      } else {
        alert(`role operate fail: ${result.data.message || "未知错误"}`);
      }
      
      // 更新用户列表
      fetchUsersWithRoles(selectedRoleId, currentPage);
      } catch (error) {
        console.log("无法更新用户角色:", error);
        alert("角色操作失败: 网络或服务器错误");
      }
  };

  // 数据加载
  useEffect(() => {
    fetchRoles();
    fetchUsersWithRoles(selectedRoleId, currentPage);
  }, [selectedRoleId, currentPage]);

  // 编辑角色
  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);
    setCurrentPage(1);
  };

  // 换页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* 角色选择 */}
      <div className="mb-4 flex items-center space-x-4">
        <label htmlFor="roleSelect" className="text-gray-700 font-medium">
          选择角色:
        </label>
        <RoleSelector selectedRoleId={selectedRoleId} onRoleChange={handleRoleChange} />
      </div>

      {/* 用户列表 */}
      <div className="space-y-4">
        {userList.map((user) => (
          <div
            key={user.idUser}
            className="flex items-center justify-between p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-300"
          >
            {/* 头像 */}
            <Image
              src={user.avatarUrl || "/images/default-avatar.jpg"}
              alt="Avatar"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full mr-4"
            />

            {/* 用户信息 */}
            <div className="flex-1 flex items-center space-x-6">
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <strong>昵称:</strong> {user.nickname}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>账号:</strong> {user.account}
                </p>
              </div>

              {/* 角色标签，右对齐 */}
              <span className="ml-auto flex flex-wrap space-x-2">
                <strong>角色:</strong>
                {roleList.map((role) => {
                  const hasRole = user.roles?.includes(role.name) || false;
                  const isSuperAdmin = role.name === "超级管理员" && user.roles?.includes("超级管理员");

                  return (
                    <span
                      key={role.idRole}
                      onClick={() => !isSuperAdmin && toggleUserRole(user.idUser, role.idRole, hasRole)}
                      className={`px-2 py-1 text-sm rounded-full cursor-pointer ${
                        isSuperAdmin
                          ? "bg-yellow-500 text-white"  // 超级管理员使用金黄色背景
                          : hasRole
                          ? "bg-purple-400 text-white"  // 有角色的使用紫色背景
                          : "bg-gray-200 text-gray-600"  // 无角色的使用灰色背景
                      }`}
                    >
                      {role.name}
                    </span>
                  );
                })}
              </span>
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