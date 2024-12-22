"use client";

import { useState } from "react";
import request from "@/utils/request"; // 引入封装后的 request

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUser = ({ isOpen, onClose }: AddUserProps) => {
  const [formData, setFormData] = useState({
    account: "",
    password: "",
    nickname: "",
    realName: "",
    sex: "1", // 默认为1 (男性)
    email: "",
    phone: "",
    signature: "",
  });

  const [errors, setErrors] = useState({
    account: "",
    nickname: "",
    password: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 清除相应字段的错误
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    // 必填字段验证
    if (!formData.account) {
      newErrors.account = "account is required";
    }
    if (!formData.nickname) {
      newErrors.nickname = "nickname is required";
    }
    if (!formData.password) {
      newErrors.password = "password is required";
    }
    if (!formData.email) {
      newErrors.email = "email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // 如果没有错误，返回true
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // 如果表单验证失败，不继续提交
    }

    try {
      // 使用封装后的 request 进行 API 请求
      const result = await request({
        url: "/admin/user/add-user", // 创建用户的 API 路径
        method: "POST",
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // 从本地存储中获取 token
        },
      });

      if (result.data.success) {
        alert("用户创建成功");
        onClose(); // 关闭模态框
      } else {
        alert(result.data.message || "用户创建失败");
      }
    } catch (error) {
      console.error("创建用户时发生错误:", error);
      alert("用户创建时发生错误");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">创建新用户</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium">账号</label>
            <input
              type="text"
              name="account"
              value={formData.account}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.account ? "border-red-500" : ""
              }`}
              placeholder="请输入账号"
            />
            {errors.account && <p className="text-red-500 text-xs">{errors.account}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">密码</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder="请输入密码"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">昵称</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.nickname ? "border-red-500" : ""
              }`}
              placeholder="请输入昵称"
            />
            {errors.nickname && <p className="text-red-500 text-xs">{errors.nickname}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">邮箱</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="请输入邮箱"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">真实姓名</label>
            <input
              type="text"
              name="realName"
              value={formData.realName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="请输入真实姓名"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">手机</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="请输入手机号码"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">签名</label>
            <textarea
              name="signature"
              value={formData.signature}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="请输入签名"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-purple-300 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              提交
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 bg-purple-300 text-white px-6 py-2 rounded-md hover:bg-gray-200"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;