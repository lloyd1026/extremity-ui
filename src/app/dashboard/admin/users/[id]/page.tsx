"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import request from "@/utils/request";
import Image from "next/image";
import config from '@/config/baseurl_config';

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

const UserDetail = () => {
  const { id } = useParams(); // 获取路由中的用户ID
  const [userInfo, setUserInfo] = useState<UserInfoDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchUserInfo(Number(id)); // 请求用户详情
    }
  }, [id]);

  // 获取用户详细信息
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
      }
    } catch (err) {
      console.error(err);
      setError("请求失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {loading && <p>加载中...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {userInfo && (
        <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <Image
              src={userInfo?.avatarUrl ? `${config.imageUrl}${userInfo.avatarUrl}` : "/images/default-avatar.jpg"}
              alt="用户头像"
              width={100}
              height={100}
              className="rounded-full"
            />
            <h2 className="text-3xl font-bold">{userInfo.nickname}</h2>
          </div>

          <div className="space-y-4">
            {[
              { label: "账号", value: userInfo.account },
              { label: "Email", value: userInfo.email },
              { label: "手机", value: userInfo.phone || "未提供" },
              { label: "性别", value: userInfo.sex === "0" ? "女" : "男" },
              { label: "签名", value: userInfo.signature || "无" },
              { label: "状态", value: userInfo.status },
              { label: "最后登录时间", value: userInfo.lastLoginTime },
              { label: "最后在线时间", value: userInfo.lastOnlineTime },
              { label: "创建时间", value: userInfo.createdTime },
            ].map((item, index) => (
              <div key={index} className="flex justify-center items-center">
                <span className="font-semibold mr-4">{item.label}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;