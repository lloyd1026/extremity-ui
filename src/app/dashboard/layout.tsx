'use client'; // 确保这是一个 Client Component
import '../globals.css'; // 导入全局样式
import { AuthProvider } from '@/app/dashboard/components/auth/authcontext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
        <div>
          <main>{children}</main>
        </div>
    </AuthProvider>
  );
};

export default Layout;
