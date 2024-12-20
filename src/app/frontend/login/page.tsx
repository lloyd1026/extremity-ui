// src/app/page.tsx
'use client'; // 确保这是一个 Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 用来跳转页面
import Login from '@/app/frontend/components/login'; // 导入登录组件

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter(); // 初始化router，用于页面跳转

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn'); // 假设使用 localStorage 存储登录状态
    if (loginStatus === 'true') {
      setIsLoggedIn(true); // 用户已登录
    } else {
      setIsLoggedIn(false); // 用户未登录
    }
  }, []);

  //如果用户已登录，跳转到其他页面（比如首页或者其他页面）
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/'); // 跳转到主页或其他页面
    }
  }, [isLoggedIn]);

  return (
    <div>
      {/* 如果未登录，显示登录组件 */}
      {!isLoggedIn && 
      <Login />}
      {/* 如果已登录，显示相应的内容或者跳转 */}
    </div>
  );
};

export default HomePage;
