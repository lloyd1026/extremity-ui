"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import request from "@/utils/request";
import Image from "next/image";
import config from "@/config/baseurl_config";

export interface TeamMemberInfo {
  teamMemberId: number; 
  account: string; 
  nickname: string; 
  realName: string; 
  sex: string; 
  avatarUrl: string; 
  email: string; 
  phone: string; 
  status: string | number; 
  signature: string; 
  bgImgUrl: string; 
  position: string; 
  researchDirection: string; 
  personalBio: string; 
  researchOverview: string; 
}

const UserDetail = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState<TeamMemberInfo | null>(null);
  const [tempUserInfo, setTempUserInfo] = useState<TeamMemberInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);

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
        setTempUserInfo(response.data.data);
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

  const handleInputChange = (field: keyof TeamMemberInfo, value: string) => {
    if (tempUserInfo) {
      setTempUserInfo({
        ...tempUserInfo,
        [field]: value,
      });
    }
  };

  const handleFileChange = async (
    field: "avatarUrl" | "bgImgUrl",
    file: File
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await request.post("/user/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        const imageUrl = response.data.url;
        if (tempUserInfo) {
          setTempUserInfo({
            ...tempUserInfo,
            [field]: imageUrl,
          });
        }
        alert("图片上传成功！");
      } else {
        alert("图片上传失败：" + (response.data.message || "未知错误"));
      }
    } catch (error) {
      console.error(error);
      alert("图片上传失败，请稍后重试");
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...tempUserInfo };

      const response = await request.post(`/team-admin/edit-member-info`, payload);
      if (response.data.success) {
        alert("保存成功！");
        setUserInfo(tempUserInfo);
        setEditing(false);
      } else {
        alert("保存失败：" + (response.data.message || "未知错误"));
      }
    } catch (error) {
      console.error(error);
      alert("请求失败，请稍后重试");
    }
  };

  const renderField = (
    label: string,
    field: keyof TeamMemberInfo,
    type: string = "text"
  ) => (
    <div className="flex flex-col mb-4">
      <label className="font-semibold mb-1">{label}:</label>
      {editing && field !== "account" && field !== "email" ? (
        field === "sex" ? (
          <select
            value={tempUserInfo?.[field] || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="border rounded p-2"
          >
            <option value="1">男</option>
            <option value="0">女</option>
          </select>
        ) : field === "status" ? (
          <select
            value={tempUserInfo?.[field] || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="border rounded p-2"
          >
            <option value="1">在线</option>
            <option value="0">离线</option>
          </select>
        ) : (
          <input
            type={type}
            value={tempUserInfo?.[field] || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="border rounded p-2"
          />
        )
      ) : (
        <span>
          {field === "sex"
            ? userInfo?.[field] === "1"
              ? "男"
              : "女"
            : field === "status"
            ? userInfo?.[field] === "1"
              ? "在线"
              : "离线"
            : userInfo?.[field] || "未提供"}
        </span>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      {loading && <p>加载中...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {userInfo && (
        <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <Image
              src={
                userInfo.avatarUrl
                  ? `${config.imageUrl}${userInfo.avatarUrl}`
                  : "/images/default-avatar.jpg"
              }
              alt="用户头像"
              width={100}
              height={100}
              className="rounded-full"
            />
            {editing && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleFileChange("avatarUrl", e.target.files[0])
                }
                className="mt-2"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("真实姓名", "realName")}
            {renderField("账号", "account")}
            {renderField("邮箱", "email")}
            {renderField("手机号", "phone")}
            {renderField("性别", "sex")}
            {renderField("状态", "status")}
            {renderField("签名", "signature")}
            {renderField("职位", "position")}
            {renderField("研究方向", "researchDirection")}
            {renderField("个人简介", "personalBio")}
            {renderField("研究概览", "researchOverview")}
          </div>

          {editing ? (
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                onClick={handleSave}
              >
                保存
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setEditing(false)}
              >
                取消
              </button>
            </div>
          ) : (
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setEditing(true)}
              >
                编辑
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDetail;