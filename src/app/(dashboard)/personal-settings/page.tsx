import Image from 'next/image';
import { FaSave } from 'react-icons/fa'; // 使用react-icons来添加保存图标

const UserSettings = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* 页面标题 */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">个人设置</h1>

      {/* 个人信息 */}
      <div className="flex items-center mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
          <Image
            src="/images/default-avatar.jpg"
            alt="User Avatar"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-medium text-gray-700">用户名: 超级管理员</h2>
          <p className="text-gray-500">邮箱: admin@example.com</p>
        </div>
      </div>

      {/* 设置表单 */}
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">修改邮箱</label>
          <input
            type="email"
            className="mt-2 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="请输入新邮箱"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">修改密码</label>
          <input
            type="password"
            className="mt-2 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="请输入新密码"
          />
        </div>

        {/* 通知设置 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">通知设置</label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-indigo-600" />
              <span className="ml-2">接收通知</span>
            </label>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="mt-6 flex justify-end">
        <button className="flex items-center bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors">
          <FaSave className="mr-2" /> 保存
        </button>
      </div>
    </div>
  );
};

export default UserSettings;