'use client'; // 确保这是一个 Client Component

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import request from "@/utils/request";

const forgetPassword = () => {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { code } = useParams();

  const handleForget = async (e: React.FormEvent) => {
    e.preventDefault(); // 防止表单提交
    console.log(code)
    // 如果有验证码，可以继续注册逻辑
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 防止按 Enter 键时表单提交
      handleForget(e as any);   // 调用注册函数
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          action="#"
          method="POST"
          className="space-y-6"
          onSubmit={handleForget} // 在表单提交时触发注册
        >
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              密码
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} // 绑定到 username
                onKeyDown={handleKeyDown} // 绑定 handleKeyDown
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>
          
          <div>

            <button
                type="submit" // 按钮类型为 submit
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              修改密码
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default forgetPassword;
