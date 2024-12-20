'use client'; // 确保这是一个 Client Component
import { useState } from 'react';
import PeopleNews from "@/app/frontend/components/peopleNews";
import Login from '@/app/frontend/components/login';

export default function PeopleNewsPage() {
  // 当前选中的组件，默认为 PeopleNews
  const [selectedComponent, setSelectedComponent] = useState('peopleNews');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(JSON.parse(localStorage.getItem("isLoggedIn") || "false"));

  // 导航项
  const navItems = [
    { name: '个人信息管理 ', value: 'peopleNews' },
    { name: '所发表的文献', value: 'anotherComponent' },
  ];

  // 渲染对应的组件
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'peopleNews':
        return <PeopleNews />;
      case 'anotherComponent':
        return <Login />;
      default:
        return <PeopleNews />;
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="flex min-h-screen">
          {/* 左侧导航栏 */}
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

          {/* 右侧内容区域 */}
          <div className="flex-1 p-6">
            {renderComponent()}
          </div>
        </div>
      ) : (
        // 如果未登录，显示“请先登录”提示
        <div className="flex min-h-screen justify-center items-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-semibold">请先登录</h2>
          </div>
        </div>
      )}
    </>
  );
}
