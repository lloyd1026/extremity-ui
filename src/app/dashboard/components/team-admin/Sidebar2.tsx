import { FaUsers, FaClipboardList, FaCogs, FaArrowLeft, FaArrowRight, FaPaperPlane, FaCommentDots } from 'react-icons/fa'; // 更新图标
import { Transition } from '@headlessui/react';
import { usePathname } from 'next/navigation';  // 用于布局和客户端导航
import Link from 'next/link'; // 导入 next/link 进行路由跳转

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar2 = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const pathname = usePathname(); // 获取当前路径

  // 用于判断当前路径
  const getNavLinkClass = (path: string) => {
    return pathname === path
      ? 'bg-purple-300 text-white hover:bg-purple-300'  // 高亮当前页面按钮，使用淡紫色
      : 'hover:bg-purple-50 text-black';  // 默认按钮样式，使用淡紫色的hover效果
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      <Transition
        show={isOpen}
        enter="transition-transform duration-[300ms] ease-in-out"
        enterFrom="-translate-x-64"
        enterTo="translate-x-0"
        leave="transition-transform duration-[300ms] ease-in-out"
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
          <h2 className="text-2xl font-semibold mb-8 text-center text-black">团队管理员</h2>
          <nav>
            <ul>
              <li className={`flex items-center mb-4 py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors ${getNavLinkClass('/dashboard/team-admin/team-info')}`}>
                <FaUsers className="mr-4 text-xl text-black" />
                <Link href="team-info" className="text-lg text-black hover:text-purple-900">
                  团队管理
                </Link>
              </li>
              
              <li className={`flex items-center mb-4 py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors ${getNavLinkClass('/dashboard/team-admin/results')}`}>
                <FaPaperPlane className="mr-4 text-xl text-black" /> {/* 使用 FaPaperPlane 替代 FaShieldAlt */}
                <Link href="results" className="text-lg text-black hover:text-purple-900">
                  成果管理与发布
                </Link>
              </li>

              <li className={`flex items-center mb-4 py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors ${getNavLinkClass('/dashboard/team-admin/content')}`}>
                <FaClipboardList className="mr-4 text-xl text-black" />
                <Link href="content" className="text-lg text-black hover:text-purple-900">
                  文章管理
                </Link>
              </li>

              <li className={`flex items-center mb-4 py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors ${getNavLinkClass('/dashboard/team-admin/users')}`}>
                <FaCogs className="mr-4 text-xl text-black" />
                <Link href="users" className="text-lg text-black hover:text-purple-900">
                  用户管理
                </Link>
              </li>

              <li className={`flex items-center mb-4 py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors ${getNavLinkClass('/dashboard/team-admin/chatting')}`}>
                <FaCommentDots className="mr-4 text-xl text-black" /> {/* 使用 FaCommentDots 替代 FaCogs */}
                <Link href="chatting" className="text-lg text-black hover:text-purple-900">
                  在线交流与反馈
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Transition>

      {/* Sidebar Toggle Button */}
      <button
        className={`fixed top-1/2 transform -translate-y-1/2 ${isOpen ? 'left-[250px]' : 'left-[10px]'} p-3 bg-gray-200 text-black rounded-full shadow-lg ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-[400ms] ease-in-out`}
        onClick={toggleSidebar}
        style={{ zIndex: 20 }}  // 确保按钮显示在最上面
      >
        {isOpen ? (
          <FaArrowLeft size={24} className="transform rotate-180" />
        ) : (
          <FaArrowRight size={24} />
        )}
      </button>
    </div>
  );
};

export default Sidebar2;