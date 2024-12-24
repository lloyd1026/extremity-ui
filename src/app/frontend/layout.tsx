'use client'; // 确保这是一个 Client Component
import '../globals.css'; // 导入全局样式
import { AuthProvider } from './components/auth/authcontext';
import Header from './components/header/header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <Header/>
        <div>
          <main>{children}</main>
        </div>
    </AuthProvider>
  );
};

export default Layout;
