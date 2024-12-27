"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import request from "@/utils/request";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  // 登录表单提交事件
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      const response = await request.post('auth/login', {
          "account": email,
          "password": password 
        }, // 发送用户输入的邮箱和密码
      )
      if (response.data.success) {
        // 登录成功后，存储 token 和 refreshToken
        // localStorage 是浏览器提供的一个 Web API
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);

        // 确保在客户端环境下才执行路由跳转
        console.log("login success");
        console.log("login role:" + response.data.message)
        // 根据不同的角色跳转到不同的页面
        switch (response.data.message) {
          case '1':
            router.push('/dashboard/admin/users');
            break;
          case '2':
            router.push('/dashboard/team-admin/team-info');
            break;
          default:
            alert('未知角色，无法跳转'); // 没什么用，不能保护
        }
      } else {
        alert('登录失败：' + response.data.message); // 如果登录失败，显示错误消息
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
          <Image
            alt="Your Company"
            src="/images/logos/logo.webp"
            width={600} // Required width
            height={600} // Required height
            className="mx-auto h-16 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
            后台管理员登录
          </h2>
        </div>

        <div className="relative mt-10 sm:mx-auto sm:w-full sm:max-w-sm z-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                账号/邮箱
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
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
                {loading ? '登录中...' : '登录'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}