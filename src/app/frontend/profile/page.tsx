'use client'; // 确保这是一个 Client Component
import { useEffect, useState } from 'react';
import { useAuth } from '../components/auth/authcontext';
import Loading from '../components/loading/loading';
import PrivateRoute from '../components/auth/privateroute';
import Profile from '../components/profile/profile';

export default function ProfilePage() {
  const [selectedComponent, setSelectedComponent] = useState('Profile');
  const [mounted, setIsMounted] = useState(false);
  const {auth} =useAuth();

  const navItems = [
    { name: '个人信息管理 ', value: 'Profile' },
    { name: '所发表的文献', value: 'anotherComponent' },
  ];

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Profile':
        return <Profile />;
      case 'anotherComponent':
        return null;
      default:
        return <Profile />;
    }
  };
  useEffect(()=>{
    setIsMounted(true)
  },[auth])

  return (
    mounted&&
    <PrivateRoute roles={[1]}>
      {
        auth!==null&&auth!==undefined&&
        <div className="flex min-h-screen">
          <div className="w-1/5 bg-gray-200 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.value}>
                  <button
                    onClick={() => setSelectedComponent(item.value)}
                    className={`w-full text-left p-2 rounded-lg hover:bg-gray-300 ${
                      selectedComponent === item.value ? 'bg-gray-300' : ''
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 p-6">
            {renderComponent()}
          </div>
        </div>
      }
      </PrivateRoute>
  );
}
