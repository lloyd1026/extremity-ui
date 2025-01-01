"use client";
import { useState, useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import config from '@/config/baseurl_config';
import request from "@/utils/request";

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

const NormalUsersActivatedPage = () => {
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const usersPerPage = 10;
    const currentPageData = userRoles.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );
    const totalPages = Math.ceil(userRoles.length / usersPerPage);

    const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await request.get("team-admin/get-activated-normal-users", {
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

    // 注销账户
    const handleDelete = async (userId: number) => {
        // 弹出确认框，询问用户是否确认注销
        const isConfirmed = window.confirm('您确定要注销此账户吗？');
        
        if (!isConfirmed) {
            // 如果用户点击“取消”，则不进行任何操作
            return;
        }
        try {
          const response = await request.get('team-admin/delete-user',{
                params: { idUser: userId },
            }
          );
    
          if (response.data.success) {
            alert('注销成功');
            fetchUsers(); // 刷新用户列表
          } else {
            alert('操作失败');
          }
        } catch (error) {
            console.log(error)
            alert('网络错误');
        }
    };

    // 页面跳转到用户信息详情页
    const handleTeamMemberClick = (userId: number) => {
        router.push(`/dashboard/team-admin/users/${userId}`); // 跳转到用户详情页
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return <div>加载中...</div>;
    }
    
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
          <h1 className="text-3xl font-bold text-center mb-6">普通用户申请列表</h1>
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
                </div>
    
                {/* 状态和操作按钮 */}
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                    {user.roleName}
                  </span>
                  <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                    {user.activated === 0 ? "申请中" : "已通过"}
                  </span>
    
                  
                    <div className="flex space-x-2">
                  
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 阻止事件冒泡，避免点击按钮时触发跳转
                          handleDelete(user.idUser); // 执行通过逻辑
                        }}
                        className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                      >
                        注销
                      </button>
                    </div>
                    
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

}




export default NormalUsersActivatedPage;