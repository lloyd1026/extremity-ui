"use client";

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './authcontext';
import Loading from '@/app/frontend/components/loading/loading';

interface PrivateRouteProps {
  children: ReactNode;
  roles?: number[]; // 允许访问的角色数组
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth === undefined) {
      // 正在加载，不进行任何操作
      return;
    }

    if (auth === null) {
      console.log("跳转到登录页");
      router.push('/dashboard/login');
      return;
    }

    if (roles && roles.length > 0) {
      const userRoles = auth.scope; // 假设 auth.scope 是一个数字数组
      const hasRequiredRole = roles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        console.log("无权限，跳转到未授权页");
        router.push('/unauthorized');
      }
    }
  }, [auth, roles, router]);

  if (auth === undefined) {
    return <Loading />;
  }
  return <>{children}</>;
};
export default PrivateRoute;