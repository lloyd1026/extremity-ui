// src/app/page.tsx
'use client'; // 确保这是一个 Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 用来跳转页面
import Login from '@/app/frontend/components/login/login'; // 导入登录组件
import { useAuth } from '../components/auth/authcontext';
import Loading from '../components/loading/loading';

const HomePage: React.FC = () => {
  const router = useRouter(); // 初始化router，用于页面跳转
  const {auth} = useAuth();
  const [mounted, setIsMounted] = useState(false);
  useEffect(() => {
    if (auth!==undefined && auth!==null) {
      console.log(auth)
      console.log("应该跳转")
      router.push('/frontend'); // 跳转到主页或其他页面
    }
    setIsMounted(true)
  }, [auth]);

  return (
    mounted?
    (<div>
      {(auth === undefined)?
      <Loading/>:<Login/>}
    </div>)
    :
    (<Loading/>)
  );
};

export default HomePage;
