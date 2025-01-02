"use client";

import { useState } from "react";
import AddTeamMember from "@/app/dashboard/components/team-admin/AddTeamMember";
import { usePathname } from "next/navigation";
import AccountDeletionModal from '@/app/dashboard/components/team-admin/AccountDeletion'; // 导入组件


const TeamPermissionsManage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const currentPath = usePathname();


  const handleTabClick = (tab: string, tabName: string) => {
    // 使用 currentPath 拼接目标路径
    const targetPath = `${currentPath}${tab}`;

    console.log("当前页面的路径：" + currentPath);
    console.log("目标跳转路径：" + targetPath);

    // 在新标签页打开目标路径
    window.open(targetPath, tabName);
  }


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>

      {/* 新增用户模态框 */}
      <AddTeamMember isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {/* 传递 isOpen 和 onClose 属性来控制模态框的显示 */}
      <AccountDeletionModal isOpen={isModalOpen} onClose={handleCloseModal} />

      <div className="container mx-auto my-8 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          用户管理面板
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative flex items-center justify-between p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-300 group cursor-pointer w-full"
            onClick={() => setIsAddModalOpen(true)}
          >
            创建团队成员
          </div>
          <div className="relative flex items-center justify-between p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-300 group cursor-pointer w-full"
            onClick={handleOpenModal}
          >
            查看注销申请
          </div>
          <div className="relative flex items-center justify-between p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-300 group cursor-pointer w-full"
            onClick={() => handleTabClick("/normal-users/pending", "普通用户申请列表")}
          >
            查看待审核普通用户
          </div>
          <div className="relative flex items-center justify-between p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-300 group cursor-pointer w-full"
            onClick={() => handleTabClick("/team-users/pending", "团队成员申请列表")}
          >
            查看待审核团队成员
          </div>
          <div className="relative flex items-center justify-between p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-300 group cursor-pointer w-full"
            onClick={() => handleTabClick("/normal-users/activated", "普通用户列表")}
          >
            查看已认证普通用户
          </div>
          <div className="relative flex items-center justify-between p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-300 group cursor-pointer w-full"
            onClick={() => handleTabClick("/team-users/activated", "团队用户列表")}
          >
            查看已认证团队成员
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default TeamPermissionsManage;