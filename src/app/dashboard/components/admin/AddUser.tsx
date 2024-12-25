"use client";

import { useState } from "react";
import request from "@/utils/request";

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUser = ({ isOpen, onClose }: AddUserProps) => {
  const [formData, setFormData] = useState({
    account: "",
    password: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await request({
        url: "/admin/user/add-user",
        method: "POST",
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="请输入账号"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">密码</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="请输入密码"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">邮箱</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="请输入邮箱"
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
              className="ml-4 bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
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