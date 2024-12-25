"use client";
import React, { useState, useEffect } from "react";
import request from "@/utils/request";

interface TeamInfo {
  teamId: number;
  teamName: string;
  description: string;
  researchField: string;
}

const TeamInfoPage = () => {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null); // 存储团队信息
  const [isLoading, setLoading] = useState(false); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息
  const [isModalOpen, setModalOpen] = useState(false); // 控制弹窗状态
  const [formData, setFormData] = useState<TeamInfo | null>(null); // 表单数据

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
        setTeamInfo(response.data.data); // 保存团队信息
        setFormData(response.data.data); // 初始化表单数据
      } else {
        setError("获取团队信息失败");
      }
    } catch (error) {
      console.error(error);
      setError("无法加载团队信息");
    } finally {
      setLoading(false);
    }
  };

  // 提交表单保存编辑信息
  const saveTeamInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const response = await request.post("/team-admin/team/edit", formData,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setTeamInfo(formData); // 更新页面显示
        toggleModal(); // 关闭弹窗
        alert("信息修改成功！"); // 使用原生 alert 提供反馈
      } else {
        alert("保存失败，请重试！");
      }
    } catch (error) {
      console.error(error);
      alert("保存失败，请检查网络！");
    }
  };

  // 打开或关闭弹窗
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // 表单字段变化处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value } as TeamInfo);
  };

  useEffect(() => {
    fetchTeamInfo(); // 页面加载时获取数据
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="relative w-4/5 max-w-4xl p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-purple-600">
          团队信息
        </h1>

        <button
          onClick={toggleModal}
          className="absolute top-4 right-4 px-4 py-2 bg-purple-300 text-white rounded-md shadow hover:bg-purple-600 transition"
        >
          编辑信息
        </button>
        {isLoading ? (
          <p className="text-center text-gray-500">加载中...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : teamInfo ? (
          <div className="space-y-4">
            <p className="text-lg font-medium text-gray-700">
              <strong className="text-purple-500">团队 ID：</strong> {teamInfo.teamId}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong className="text-purple-500">团队名称：</strong> {teamInfo.teamName}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong className="text-purple-500">描述：</strong> {teamInfo.description}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong className="text-purple-500">研究领域：</strong>{" "}
              {teamInfo.researchField}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500">未找到团队信息</p>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-1/2 bg-gray-200 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">
                编辑团队信息
              </h2>
              <form onSubmit={saveTeamInfo}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium">
                    团队名称
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData?.teamName || ""}
                    onChange={handleInputChange}
                    className="w-full mt-2 p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium">描述</label>
                  <textarea
                    name="description"
                    value={formData?.description || ""}
                    onChange={handleInputChange}
                    className="w-full mt-2 p-2 border border-gray-300 rounded"
                    rows={6} // 调整为更大的文本框（增加行数）
                    style={{ minHeight: "120px" }} // 或者你可以设置最小高度
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium">
                    研究领域
                  </label>
                  <input
                    type="text"
                    name="researchField"
                    value={formData?.researchField || ""}
                    onChange={handleInputChange}
                    className="w-full mt-2 p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamInfoPage;