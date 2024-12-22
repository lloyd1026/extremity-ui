"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();      // react 提供的hook，页面的跳转

  // 登录表单提交事件
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/extremity/api/auth/adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account: email, password }), // 发送用户输入的邮箱和密码
      });

      const data = await response.json();

      if (data.success) {
        // 登录成功后，存储 token 和 refreshToken
        // localStorage 是浏览器提供的一个 Web API
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);

        // 确保在客户端环境下才执行路由跳转
        console.log("login success");
        
        router.push('/admin/users');
      } else {
        alert('登录失败：' + data.message); // 如果登录失败，显示错误消息
      }
    } catch (error) {
      console.error('登录请求失败', error);
      alert('登录请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 登陆界面
  return (
    <>
      <div className="relative flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[url('/images/bg/bg3.jpg')] bg-cover bg-center h-screen">
        {/* 半透明的背景层 */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* 登录表单 */}
        <div className="relative sm:mx-auto sm:w-full sm:max-w-sm z-10">
          <img
            alt="Your Company"
            src="/images/logos/logo.webp"
            className="mx-auto h-16 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="relative mt-10 sm:mx-auto sm:w-full sm:max-w-sm z-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? 'Logging in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    </>
  );
}