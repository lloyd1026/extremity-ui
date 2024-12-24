"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import request from "@/utils/request"; 

interface UserInfoDTO {
  idUser: number;
  account: string;
  avatarUrl: string;
  nickname: string;
  email: string;
  phone?: string;
  status: string;
  sex: string;
  signature?: string;
  lastLoginTime: string; 
  lastOnlineTime: string; 
  createdTime: string; 
}

interface ShowUserInfoProps {
  idUser: number; 
  isOpen: boolean;
  onClose: () => void;
}

const ShowUserInfo = ({ idUser, isOpen, onClose }: ShowUserInfoProps) => {
  const [userInfo, setUserInfo] = useState<UserInfoDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 获取用户详细信息
  const fetchUserInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request.get(`/admin/user/show-user-info`, {
        params: { idUser },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setUserInfo(response.data.data);
      } else {
        setError("无法加载用户详细信息");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("请求失败，请稍后重试");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && idUser) {
      fetchUserInfo();
    } else {
      setUserInfo(null); // 清空数据
    }
  }, [isOpen, idUser]);

  if (!isOpen) return null; // 如果模态框未打开，则不渲染

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">用户详细信息</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {loading && <p>加载中...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {userInfo && (
          <div>
            <div className="flex items-center mb-4">
              <Image
                src={userInfo.avatarUrl || "/images/default-avatar.jpg"}
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full mr-4"
              />
              <div>
                <p><strong>昵称:</strong> {userInfo.nickname}</p>
                <p><strong>账号:</strong> {userInfo.account}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>手机:</strong> {userInfo.phone || "未提供"}</p>
                <p><strong>性别:</strong> {userInfo.sex}</p>
                <p><strong>签名:</strong> {userInfo.signature || "无"}</p>
                <p><strong>状态:</strong> {userInfo.status}</p>
                <p><strong>最后登录时间:</strong> {userInfo.lastLoginTime}</p>
                <p><strong>最后在线时间:</strong> {userInfo.lastOnlineTime}</p>
                <p><strong>创建时间:</strong> {userInfo.createdTime}</p>
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowUserInfo;