import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useAuth } from './authcontext';
import Loading from '../loading/loading';

interface PrivateRouteProps {
  children: ReactNode;
  roles?: number[]; // 允许访问的角色数组
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(auth!==undefined){
        if(auth===null){
          console.log("跳转登陆")
          router.push('/frontend/login');
        }
        else if (roles && !roles.some(role => auth.scope.includes(role))) {
          router.push('/unauthorized');
        }
    }
  }, [auth]);
  return auth===undefined?<Loading/>:<>{children}</>; // 如果认证通过并且角色匹配，则渲染子组件
};

export default PrivateRoute;