import { useRouter } from 'next/navigation'; // 用于页面跳转

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // 弹出确认框
    const confirmLogout = window.confirm('确定要退出登录吗？');
    
    if (confirmLogout) {
      // 清除 sessionStorage
      sessionStorage.clear();

      // 清除 localStorage
      localStorage.clear();

      // 清除 cookies
      document.cookie.split(';').forEach((cookie) => {
        const cookieName = cookie.split('=')[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });

      // 跳转到登录页面
      router.push('/dashboard/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded-lg"
    >
      退出登录
    </button>
  );
};

export default LogoutButton;