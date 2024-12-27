"use client";

import { PhotoIcon} from '@heroicons/react/24/solid';
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
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 存储预览图片的URL
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null); // 存储选择的图片
  const [image2, setImage2] = useState<File | null>(null); // 存储选择的图片



  useEffect(() => {
    if (id) {
      fetchUserInfo(Number(id));
    }
  }, [id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImagePreview(fileReader.result as string); // 设置图片预览
        
      };
      fileReader.readAsDataURL(file); // 读取图片文件为Data URL
    }
  };

  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage2(file);
    }
  };

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

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('teamMemberInfoDTO', JSON.stringify(tempUserInfo)); // 添加 JSON 数据
      if (image) {
        formData.append('file', image); // 将图片文件添加到FormData
      }
      if(image2){
        formData.append('file2', image2);
      }
      
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      const response = await request.post(`/team-admin/edit-member-info`, formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

  const currentImage = () => {
    if (imagePreview === null) {
      if (tempUserInfo && tempUserInfo.avatarUrl) {
        return `${config.imageUrl}${tempUserInfo.avatarUrl}`;
      }
      return "/images/default-avatar.jpg"; // 默认头像
    } else {
      return imagePreview; // 直接返回 Data URL
    }
  }

  // const currentImage2 = () => {
  //   if (image2) {
  //     return URL.createObjectURL(image2);
  //   }
  //   if (tempUserInfo && tempUserInfo.bgImgUrl) {
  //     return `${config.imageUrl}${tempUserInfo.bgImgUrl}`;
  //   }
  //   return "/images/default-bg.jpg"; // 默认背景图
  // };

  return (
    <div className="container mx-auto p-6">
      {/* 内容区 */}
      <div className="relative z-10 bg-white bg-opacity-80 rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-20">
        {loading && <p>加载中...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {userInfo && (
          <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
            <div className="col-span-full">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-900">
                头像
              </label>
      
              <div className="mt-2 flex justify-center items-center gap-x-3">
                  <Image
                    src={currentImage() || "/images/default-avatar.jpg"}
                    alt="Avatar Preview"
                    className="h-24 w-24 rounded-full object-cover"
                    width={96}
                    height={96}
                  />
              </div>

              {/* 上传文件部分 - 调整大小 */}
              <div className="col-span-full mt-6">
                <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-900">
                  修改头像
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-1.5 py-2">
                  <div className="text-center">
                    <PhotoIcon aria-hidden="true" className="mx-auto h-10 w-10 text-gray-300" />
                    <div className="mt-4 flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>上传文件</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="p1-1">PNG, JPG, GIF 最大10MB</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 背景图片显示与修改 */}
            <div className="col-span-full mb-6">
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  选择文件上传：
                </label>
                <input type="file" onChange={handleFileChange2} />
              </div>
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
    </div>
  );
};

export default UserDetail;