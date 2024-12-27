'use client'; // 确保这是一个 Client Component
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import request from "@/utils/request";
const LoginPage = () => {
  const [account, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const response1 = await request.get(`/user/role`,{params:{email:account}})

    if(response1.data.data==1){
      const response = await request.post(`/auth/login`,{account,password})
      if (response.data.success) {
        localStorage.setItem('token',response.data.data.token);
        localStorage.setItem('refreshToken',response.data.data.refreshToken);
        router.push('/frontend'); // 登录成功后跳转到目标页面
      }
    }
    // 在这里模拟登录验证
     else {
      alert('登录失败');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin(); // 按下 Enter 键时触发登录事件
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            登录你的账户
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            action="#"
            method="POST"
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault(); // 防止默认表单提交
              handleLogin(); // 在表单提交时触发登录
            }}
          >
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                邮箱
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={account}
                  onChange={(e) => setUsername(e.target.value)} // 绑定到 username
                  onKeyDown={handleKeyDown} // 绑定 handleKeyDown
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  密码
                </label>
                
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // 绑定到 password
                  onKeyDown={handleKeyDown} // 绑定 handleKeyDown
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <div className="text-sm">
                  <a href="/frontend/getForgetEmail" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    忘记密码
                  </a>
                </div>
            </div>

            <div>
              <button
                type="submit" // 按钮类型为 submit
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                登录
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            没有用户？{' '}
            <a href="/frontend/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              快来注册一个吧
            </a>
          </p>
          <p className="mt-10 text-center text-sm/6 text-gray-500">
            <a href="/frontend/admitted-status" className="font-semibold text-indigo-600 hover:text-indigo-500">
              查看申请状态
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
