"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import request from "@/utils/request";
import AddUser from "@/app/(dashboard)/components/AddUser";
import RoleSelector from "@/app/(dashboard)/components/RoleSelector";

interface User {
  idUser: number;
  account: string;
  nickname: string;
  avatarUrl: string;
  email: string;
  phone?: string;
  signature?: string;
}

const UserList = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const usersPerPage = 10;

  // 获取用户数据
  const fetchUsers = async (roleIds: string, page: number) => {
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
        const usersToShow = users.slice((page - 1) * usersPerPage, page * usersPerPage);
        setUserList(usersToShow);
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

  // 调用 fetchUsers
  useEffect(() => {
    console.log("当前role Id:" + selectedRoleId);
    fetchUsers(selectedRoleId, currentPage);
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

  const handleEdit = (userId: number) => {
    // 编辑用户逻辑
    console.log("编辑用户:", userId);
  };

  const handleDelete = (userId: number) => {
    // 删除用户逻辑
    console.log("删除用户:", userId);
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
      {/* <h3 className="text-xl font-semibold mb-6">团队管理员 管理</h3> */}

      {/* 角色选择与新增按钮 */}
      <div className="mb-4 flex items-center space-x-4">
        <label htmlFor="roleSelect" className="text-gray-700 font-medium">
          选择角色:
        </label>

        <RoleSelector selectedRoleId={selectedRoleId} onRoleChange={handleRoleChange} />

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-purple-300 text-white rounded-md hover:bg-purple-400 transition-all"
        >
          创建账号
        </button>
      </div>

      {/* 新增用户模态框 */}
      <AddUser isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

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
              <p className="text-sm text-gray-800">
                <strong>昵称:</strong> {user.nickname}
              </p>
              <p className="text-sm text-gray-600">
                <strong>账号:</strong> {user.account}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>电话:</strong> {user.phone || "暂无"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>签名:</strong> {user.signature || "暂无"}
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(user.idUser)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transform transition-all duration-200"
              >
                编辑
              </button>
              <button
                onClick={() => handleDelete(user.idUser)}
                className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transform transition-all duration-200"
              >
                删除
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

export default UserList;