"use client";
import React, { useState, useEffect } from "react";
import request from "@/utils/request";
import Image from "next/image";
import config from '@/config/baseurl_config';
import { useRouter } from "next/navigation";

interface TeamInfo {
  teamId: number;
  teamName: string;
  description: string;
  researchField: string;
}

interface TeamMember {
  idUser: number;
  email: string;
  idRole: number;
  roleName: string;
  createdTime: number;
  activated: number;
  avatarUrl: string;
  nickName: string;
}

const TeamInfoPage = () => {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null); // 团队信息
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]); // 团队成员
  const [isLoading, setLoading] = useState(false); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息
  const [isModalOpen, setModalOpen] = useState(false); // 编辑弹窗状态
  const [formData, setFormData] = useState<TeamInfo | null>(null); // 表单数据

  const router = useRouter();

  // 获取团队信息
  const fetchTeamInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request.get("/team-admin/team/show-info", {
        params: { teamId: "1" },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setTeamInfo(response.data.data);
        setFormData(response.data.data);
      } else {
        setError("获取团队信息失败");
      }
    } catch (err) {
      console.error(err);
      setError("无法加载团队信息");
    } finally {
      setLoading(false);
    }
  };

  // 获取团队成员
  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await request.get("team-admin/get-activated-team-members", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        const sortedData = response.data.data.sort(
          (a: TeamMember, b: TeamMember) => b.createdTime - a.createdTime
        );
        setTeamMembers(sortedData);
      } else {
        setError("无法加载成员信息");
      }
    } catch (err) {
      console.error(err);
      setError("网络错误或服务器错误");
    } finally {
      setLoading(false);
    }
  };

  // 保存编辑信息
  const saveTeamInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    try {
      const response = await request.post("/team-admin/team/edit", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setTeamInfo(formData);
        toggleModal();
        alert("信息修改成功！");
      } else {
        alert("保存失败，请重试！");
      }
    } catch (err) {
      console.error(err);
      alert("保存失败，请检查网络！");
    }
  };

  // 打开或关闭弹窗
  const toggleModal = () => setModalOpen(!isModalOpen);

  // 表单字段变化处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value } as TeamInfo);
  };

  useEffect(() => {
    fetchTeamInfo();
    fetchTeamMembers();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 space-y-6  rounded-3xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-extrabold ">团队信息</h1>

      <div className="flex items-center justify-between mb-6">
        <p className="text-2xl font-semibold text-gray-800 text-center">
          <strong>团队名称：</strong> {teamInfo?.teamName}
        </p>
        <button
          onClick={toggleModal}
          className="ml-4 px-6 py-3 bg-purple-300 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200"
        >
          编辑信息
        </button>
      </div>

      <div className="flex space-x-6">
       {/* 左侧：团队信息 */}
        <div className="w-2/5 space-y-6 relative">
          {teamInfo ? (
            <>
              {/* Research Field above description */}
              <p className="text-lg font-medium text-gray-700">
                <strong>研究领域：</strong> {teamInfo.researchField}
              </p>

              {/* Description with background */}
              <div>
                <p className="text-lg font-medium ">
                  <strong>描述：</strong> {teamInfo.description}
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-500">未找到团队信息</p>
          )}
        </div>

        {/* 右侧：成员列表 */}
        <div className="w-3/5 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">团队成员</h2>
          <div className="grid grid-cols-4 gap-4 overflow-x-auto">
            {teamMembers.map((user) => (
              <div
                key={user.idUser}
                onClick={() => router.push(`/dashboard/team-admin/users/${user.idUser}`)}
                className="flex flex-col items-center p-4 hover:shadow-lg hover:scale-105 transition-all"
              >
                <Image
                  src={user.avatarUrl ? `${config.imageUrl}${user.avatarUrl}` : "/images/default-avatar.jpg"}
                  alt="用户头像"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="mt-4 text-center">
                  <p className="font-medium text-gray-700">{user.nickName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-1/2 bg-gray-200 p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">编辑团队信息</h2>
            <form onSubmit={saveTeamInfo}>
              <label className="block mb-2">团队名称</label>
              <input
                name="teamName"
                value={formData?.teamName || ""}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded"
              />
              <label className="block mb-2">描述</label>
              <textarea
                name="description"
                value={formData?.description || ""}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded h-64"
              />
              <label className="block mb-2">研究领域</label>
              <input
                name="researchField"
                value={formData?.researchField || ""}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 bg-gray-400 rounded"
                >
                  取消
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamInfoPage;