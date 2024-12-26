"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import request from "@/utils/request";
import AddTeamMember from "@/app/dashboard/components/team-admin/AddTeamMember";
import config from '@/config/baseurl_config';
import { useRouter } from "next/navigation";
import AccountDeletionModal from '@/app/dashboard/components/team-admin/AccountDeletion'; // 导入组件


interface UserRole {
  idUser: number;
  email: string;
  idRole: number;
  roleName: string;
  createdTime: number;
  activated: number;  // 权限
  avatarUrl: string;
  nickName: string;
  message: string;
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

const TeamPermissionsManage = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isActivatedFilter, setIsActivatedFilter] = useState<boolean>(false); // false: 待审核, true: 已通过
  const [isTeamMemberFilter, setIsTeamMemberFilter] = useState<boolean>(false); // false: 普通用户, true: 团队成员
  const usersPerPage = 10;
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      // 根据筛选条件构造 endpoint
      let endpoint = "";
      if (isActivatedFilter) {
        endpoint = isTeamMemberFilter
          ? "team-admin/get-activated-team-members"
          : "team-admin/get-activated-normal-users";
      } else {
        endpoint = isTeamMemberFilter
          ? "team-admin/get-deactivated-team-members"
          : "team-admin/get-deactivated-normal-users";
      }

      const response = await request.get(endpoint, {
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
          ? "team-admin/activate-role"
          : "team-admin/deactivate-role";

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
  }, [isActivatedFilter, isTeamMemberFilter]); // 监听两个滑动按钮的状态

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReject = async (idUser: number, idRole: number) => {
    try {
      // 弹出输入框填写拒绝原因
      const message = window.prompt("请输入拒绝原因（可为空）：") || "";
      
      // 确认操作
      const confirm = window.confirm(`确定要拒绝该用户申请吗？\n理由：${message || "无"}`);
      if (!confirm) return;
  
      // 显示加载状态
      setLoading(true);

      const params = new URLSearchParams();
      params.append('idUser', idUser.toString());
      params.append('idRole', idRole.toString());
      params.append('message', message);

      // 调用后端 API 更新状态
      const response = await request.post("team-admin/reject-user", 
        params
      );
  
      if (!response.data.success) {
        throw new Error("拒绝操作失败，请稍后再试");
      }
  
      // 提示成功
      alert("已成功拒绝该用户申请");
  
      // 刷新数据列表
      fetchRoles();
    } catch (error) {
      console.error("拒绝操作失败：", error);
      alert("拒绝操作失败");
    } finally {
      // 结束加载状态
      setLoading(false);
    }
  };

  // 页面跳转到用户信息详情页
  const handleTeamMemberClick = (userId: number) => {
    router.push(`/dashboard/team-admin/users/${userId}`); // 跳转到用户详情页
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      {/* 滑动按钮区域 */}
      <div className="flex justify-start items-center mb-4 space-x-6">
        {/* 激活状态滑动按钮 */}
        <div className="relative">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isActivatedFilter}
                onChange={() => setIsActivatedFilter(!isActivatedFilter)}
                className="sr-only"
              />
              <div
                className={`block w-16 h-8 rounded-full transition-colors ${
                  isActivatedFilter ? "bg-purple-300" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`absolute top-0 left-0 w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  isActivatedFilter ? "translate-x-8" : "translate-x-0"
                }`}
              ></div>
            </div>
            <span className="ml-3 text-sm text-gray-700">
              {isActivatedFilter ? "已审核" : "待审核"}
            </span>
          </label>
        </div>

        {/* 用户类型滑动按钮 */}
        <div className="relative">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isTeamMemberFilter}
                onChange={() => setIsTeamMemberFilter(!isTeamMemberFilter)}
                className="sr-only"
              />
              <div
                className={`block w-16 h-8 rounded-full transition-colors ${
                  isTeamMemberFilter ? "bg-blue-300" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`absolute top-0 left-0 w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  isTeamMemberFilter ? "translate-x-8" : "translate-x-0"
                }`}
              ></div>
            </div>
            <span className="ml-3 text-sm text-gray-700">
              {isTeamMemberFilter ? "团队成员" : "普通用户"}
            </span>
          </label>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-purple-300 text-white rounded-md hover:bg-purple-400 transition-all"
        >
          新增成员
        </button>

        {/* 打开模态框的按钮 */}
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 text-white bg-purple-300 rounded-md hover:bg-blue-600"
        >
          查看注销申请
        </button>
      </div>

      {/* 新增用户模态框 */}
      <AddTeamMember isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {/* 传递 isOpen 和 onClose 属性来控制模态框的显示 */}
      <AccountDeletionModal isOpen={isModalOpen} onClose={handleCloseModal} />
    
      
    
      {/* 用户列表 */}
      <div className="space-y-4">
        {currentPageData.map((user) => (
          <div
            key={user.idUser}
            onClick={() => handleTeamMemberClick(user.idUser)} // 点击跳转到详情页面
            className="relative flex items-center justify-between p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-300 group cursor-pointer w-[950px] ml-6"
          >
            {/* 用户头像 */}
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
              {/* 仅对待审核用户显示申请时间 */}
              {user.activated === 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                  <strong>申请时间:</strong> {formatTimestamp(user.createdTime)}
                  </p>
              )}
              {/* 仅对待审核用户显示悬浮弹窗 */}
              {user.activated === 0 && (
                <div className="absolute top-full left-0 w-full mt-2 p-2 bg-gray-50 border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <p className="text-sm text-gray-800">
                    <strong>邮箱:</strong> {user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>申请理由：</strong> {user.message || "暂无理由"}
                  </p>
                </div>
              )}
            </div>

            {/* 状态和操作按钮 */}
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                {user.roleName}
              </span>
              <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                {user.activated === 0 ? "申请中" : "已通过"}
              </span>

              {user.activated === 0 && (
                <div className="flex space-x-2">
                  {/* 通过按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡，避免点击按钮时触发跳转
                      toggleActivationStatus(user.idUser, user.idRole, user.activated); // 执行通过逻辑
                    }}
                    className="px-3 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600"
                  >
                    通过
                  </button>
              
                  {/* 拒绝按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡，避免点击按钮时触发跳转
                      handleReject(user.idUser, user.idRole); // 执行通过逻辑
                    }}
                    className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    拒绝
                  </button>
                </div>
                )}
            
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

export default TeamPermissionsManage;