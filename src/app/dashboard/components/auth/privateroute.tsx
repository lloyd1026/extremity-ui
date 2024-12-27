import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
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
    if(localStorage.getItem("refreshToken")===null){
          router.push('/dashboard/login');
    }
    if(auth!=null&&auth!=undefined){
      if (roles && !roles.some(role => auth.scope.includes(role))) {
          console.log("未授权")
          router.push('/unauthorized');
      }
    }
  }, [auth]);
  return auth===undefined?<Loading/>:<>{children}</>; // 如果认证通过并且角色匹配，则渲染子组件
};

export default PrivateRoute;