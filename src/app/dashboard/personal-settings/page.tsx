"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const PersonalSettings = () => {
  const searchParams = useSearchParams();
  const idUser = searchParams.get("idUser");
  const [userInfo, setUserInfo] = useState<UserInfoDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (idUser) {
      fetchUserInfo(Number(idUser));
    }
  }, [idUser]);

  const fetchUserInfo = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await request.get(`/admin/user/show-user-info`, {
        params: { idUser: userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setUserInfo(response.data.data);
      } else {
        setError("无法加载用户详细信息");
        console.log(error);
      }
    } catch (err) {
      console.error(err);
      setError("请求失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (userInfo) {
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const avatarUrl = URL.createObjectURL(file);
      if (userInfo) {
        setUserInfo({ ...userInfo, avatarUrl });
      }
      setMessage("头像已成功上传！");
    }
  };

  return (
    <div className="container max-w-3xl mx-auto p-6 rounded-lg shadow-lg bg-gray-100">
      <h1 className="text-xl font-bold mb-4 text-center">个人设置</h1>
      
      <div className="flex justify-center mb-6">
        <div className="relative">
          {userInfo?.avatarUrl ? (
            <Image
              src={userInfo?.avatarUrl}
              alt="用户头像"
              width={100}
              height={100}
              className="rounded-full border-2 border-gray-300 cursor-pointer"
              onClick={handleAvatarClick}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 cursor-pointer"
              onClick={handleAvatarClick}
            >
              点击上传头像
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 shadow-md space-y-5">
        <div className="flex items-center">
          <label className="font-semibold w-24">昵称:</label>
          <input
            type="text"
            name="nickname"
            value={userInfo?.nickname || ""}
            onChange={handleInputChange}
            className="border rounded-lg px-3 py-1 flex-1"
          />
        </div>
        <div className="flex items-center">
          <label className="font-semibold w-24">邮箱:</label>
          <input
            type="email"
            name="email"
            value={userInfo?.email || ""}
            onChange={handleInputChange}
            className="border rounded-lg px-3 py-1 flex-1"
          />
        </div>
        <div className="flex items-center">
          <label className="font-semibold w-24">手机号:</label>
          <input
            type="text"
            name="phone"
            value={userInfo?.phone || ""}
            onChange={handleInputChange}
            className="border rounded-lg px-3 py-1 flex-1"
          />
        </div>
        <div className="flex items-center">
          <label className="font-semibold w-24">状态:</label>
          <select
            name="status"
            value={userInfo?.status || ""}
            onChange={handleInputChange}
            className="border rounded-lg px-3 py-1 flex-1"
          >
            <option value="1">活跃</option>
            <option value="0">禁用</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className="font-semibold w-24">性别:</label>
          <select
            name="sex"
            value={userInfo?.sex || ""}
            onChange={handleInputChange}
            className="border rounded-lg px-3 py-1 flex-1"
          >
            <option value="1">男</option>
            <option value="0">女</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className="font-semibold w-24">签名:</label>
          <input
            type="text"
            name="signature"
            value={userInfo?.signature || ""}
            onChange={handleInputChange}
            className="border rounded-lg px-3 py-1 flex-1"
          />
        </div>

        <div className="text-center mt-4">
          <button
            className="bg-purple-300 text-white px-4 py-2 rounded shadow hover:bg-purple-500"
            disabled={loading}
          >
            {loading ? "保存中..." : "保存"}
          </button>
          {message && <p className="text-green-500 mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default PersonalSettings;