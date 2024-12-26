"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import request from "@/utils/request";
import Image from "next/image";
import config from "@/config/baseurl_config";

export interface TeamMemberInfo {
  teamMemberId: number;         // 对应数据库中的 "id"
  account: string;              // 用户账号
  nickname: string;             // 用户昵称
  realName: string;             // 用户真实姓名
  sex: string;                  // 性别
  avatarUrl: string;            // 用户头像 URL
  email: string;                // 邮箱地址
  phone: string;                // 手机号
  status: string | number;      // 用户状态
  signature: string;            // 用户签名
  bgImgUrl: string;             // 背景图片 URL
  position: string;             // 职位
  researchDirection: string;    // 研究方向
  personalBio: string;          // 个人简介
  researchOverview: string;     // 研究概览
}

const UserDetail = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState<TeamMemberInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchUserInfo(Number(id));
    }
  }, [id]);

  const fetchUserInfo = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await request.get(`/team-admin/get-member-info`, {
        params: { teamMemberId: userId },
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
              src={userInfo.avatarUrl ? `${config.imageUrl}${userInfo.avatarUrl}` : "/images/default-avatar.jpg"}
              alt="用户头像"
              width={100}
              height={100}
              className="rounded-full"
            />
            <h2 className="text-3xl font-bold">{userInfo.nickname}</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <p><strong>真实姓名:</strong> {userInfo.realName}</p>
              <p><strong>账号:</strong> {userInfo.account}</p>
              <p><strong>邮箱:</strong> {userInfo.email}</p>
              <p><strong>手机号:</strong> {userInfo.phone || "未提供"}</p>
              <p><strong>性别:</strong> {userInfo.sex === "0" ? "女" : "男"}</p>
              <p><strong>状态:</strong> {userInfo.status}</p>
              <p><strong>签名:</strong> {userInfo.signature || "无"}</p>
              <p><strong>职位:</strong> {userInfo.position}</p>
              <p><strong>研究方向:</strong> {userInfo.researchDirection}</p>
              <p><strong>个人简介:</strong> {userInfo.personalBio}</p>
              <p><strong>研究概览:</strong> {userInfo.researchOverview}</p>
              <p><strong>背景图片:</strong> 
                <Image
                  src={userInfo.bgImgUrl ? `${config.imageUrl}${userInfo.bgImgUrl}` : "/images/default-bg.jpg"}
                  alt="背景图片"
                  width={200}
                  height={100}
                />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;