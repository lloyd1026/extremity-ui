'use client'; // 确保这是一个 Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { request } from '@/utils/request';

const register = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false); // 控制验证码是否已发送
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // 防止表单提交

    if (!code) {
      alert('请输入验证码');
      console.log('我注册了');  // 这里的 console.log 应该会输出
      return;
    }

    // 如果有验证码，可以继续注册逻辑
    const response = await request.post('auth/register', { email, password, code });
    if(response.success){
      alert('注册成功');
      router.push('/login'); // 登录成功后跳转到目标页面
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 防止按 Enter 键时表单提交
      handleRegister(e as any);   // 调用注册函数
    }
  };
  const handleSendCode = async () => {
    // 发送验证码的逻辑（通常是向后端请求验证码）
    const response = await request.get(`auth/get-email-code`,{email})
    if(response.success){
      setIsCodeSent(true);
    }
     // 模拟验证码已发送
    // 在实际情况下，可能会使用邮箱或手机接口请求发送验证码
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          注册你的账户
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          action="#"
          method="POST"
          className="space-y-6"
          onSubmit={handleRegister} // 在表单提交时触发注册
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              邮箱
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setUsername(e.target.value)} // 绑定到 username
                onKeyDown={handleKeyDown} // 绑定 handleKeyDown
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // 绑定到 password
                onKeyDown={handleKeyDown} // 绑定 handleKeyDown
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* 验证码输入 */}
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-900">
              验证码
            </label>
            <div className="mt-2 flex space-x-2">
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                required
                value={code}
                onChange={(e) => setVerificationCode(e.target.value)} // 绑定到验证码
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isCodeSent}
                className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
              >
                {isCodeSent ? '验证码已发送' : '获取验证码'}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit" // 按钮类型为 submit
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              注册
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default register;
