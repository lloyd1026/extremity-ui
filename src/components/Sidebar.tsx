import { FaUsers, FaShieldAlt, FaClipboardList, FaCogs, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Transition } from '@headlessui/react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  return (
    <div className="relative">
      {/* Sidebar */}
      <Transition
        show={isOpen}
        enter="transition-transform duration-300 ease-in-out"
        enterFrom="-translate-x-64"
        enterTo="translate-x-0"
        leave="transition-transform duration-300 ease-in-out"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-64"
      >
        <div
          className={`w-64 p-6 fixed left-0 border-r-5 border-gray-1000 shadow-lg backdrop-blur-sm backdrop-filter rounded-l-2xl rounded-r-2xl ${isOpen ? 'bg-gray-300' : 'bg-white'}`}
          style={{
            backgroundColor: isOpen ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.1)',  // 灰色半透明背景或白色
            marginLeft: '10px',  // 左侧留空
            marginTop: '5px',
            marginBottom: '5px', // 底部留空
            height: 'calc(100vh - 20px)', // 使侧边栏高度适应视口高度并保留顶部和底部的空隙
            bottom: '10px', // 底部留空 10px
          }}
        >
          <h2 className="text-2xl font-semibold mb-8 text-center text-black">超级管理员</h2>
          <nav>
            <ul>
              <li className="flex items-center mb-4 py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors">
                <FaUsers className="mr-4 text-xl text-black" />
                <a href="/admin/users" className="text-lg text-black hover:text-purple-900">
                  用户管理
                </a>
              </li>
              <li className="flex items-center mb-4 py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors">
                <FaShieldAlt className="mr-4 text-xl text-black" />
                <a href="/admin/permissions" className="text-lg text-black hover:text-purple-900">
                  权限管理
                </a>
              </li>
              <li className="flex items-center mb-4 py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors">
                <FaClipboardList className="mr-4 text-xl text-black" />
                <a href="/admin/content" className="text-lg text-black hover:text-purple-900">
                  内容管理
                </a>
              </li>
              <li className="flex items-center mb-4 py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors">
                <FaCogs className="mr-4 text-xl text-black" />
                <a href="/admin/settings" className="text-lg text-black hover:text-purple-900">
                  系统设置
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </Transition>

      {/* Sidebar Toggle Button */}
      <button
        className={`fixed top-1/2 transform -translate-y-1/2 ${isOpen ? 'left-[10px]' : 'left-[10px]'} p-3 bg-gray-200 text-black rounded-full shadow-lg ${isOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'} transition-transform duration-300 ease-in-out`}
        onClick={toggleSidebar}
        style={{ zIndex: 100 }}  // 确保按钮显示在最上面
      >
        {isOpen ? <FaArrowLeft size={24} /> : <FaArrowRight size={24} />}
      </button>
    </div>
  );
};

export default Sidebar;