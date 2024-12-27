// src/contexts/AuthContext.tsx

"use client"; // 正确的 Next.js 客户端指令

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import userwithRoles from '@/interfaces/userwithRoles';
import getuserwithRoles from '@/utils/getuserwithRoles';
import { UnAuthenticatedError } from '@/exceptions/CustomErrors';
import Loading from '@/app/frontend/components/loading/loading';

// 定义 AuthContext 的类型
interface AuthContextType {
  auth: userwithRoles | null;
  setAuth: React.Dispatch<React.SetStateAction<userwithRoles | null>>;
}

// 创建 AuthContext，默认值为 { auth: null, setAuth: () => {} }
const AuthContext = createContext<AuthContextType>({ auth: null, setAuth: () => {} });

// 定义 AuthProvider 的 Props 类型
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider 组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<userwithRoles | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // 获取用户信息的函数
  const getMe = async () => {
    try {
      const response = await getuserwithRoles();
      if (response.data && response.data.success && response.data.data.user) {
        console.log("当前角色：", response.data.data.user);
        setAuth(response.data.data.user);
      } else {
        console.log("当前没有角色");
        setAuth(null);
      }
    } catch (error: any) {
      console.error("获取用户信息失败：", error);
      setAuth(null);
      if (error instanceof UnAuthenticatedError) {
        console.log("进入登录页");
        router.push('/dashboard/login');
      } else {
        console.log("进入404页");
        router.push('/404');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("token === null");
      setAuth(null);
      setIsLoading(false);
      return;
    }
    getMe();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义的 useAuth Hook
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};