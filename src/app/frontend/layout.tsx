'use client'; // 确保这是一个 Client Component

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // 导入 useRouter 进行页面跳转
import '../globals.css'; // 导入全局样式
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // 获取当前路径

  const navigation = [
    { name: '主页', href: '/frontend', current: false },
    { name: '分类', href: '#', current: false },
    {name : '在线编辑',href: '#',current:false},
  ]


  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn'); // 假设使用 localStorage 存储登录状态
    if (loginStatus === 'true') {
      setIsLoggedIn(true); // 用户已登录
    } else {
      setIsLoggedIn(false); // 用户未登录
    }
  }, [pathname]);
  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
  }
  // 更新 navigation 数组中的 `current` 属性
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: pathname === item.href,  // 比较路径来判断当前项是否选中
  }));



  const handleLogin = ()=>{
   
    router.push('/frontend/login');
  }
  const handleLogout = async () => {
    // 清除登录状态
    //const response = await request.post(`/auth/logout`,{})
    //if(response.success){
      localStorage.removeItem('isLoggedIn'); // 删除登录状态
      setIsLoggedIn(false); // 更新组件的登录状态
      router.push('/frontend/login'); // 登出后跳转到主页面
    //}
    //else{
     // alert('退出失败');
   // }

  };
  return (
    <>
        <div className="relative">
          <Disclosure as="nav" className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                    <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex shrink-0 items-center">
                    <img
                      alt="Your Company"
                      src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                      className="h-8 w-auto"
                    />
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {updatedNavigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          aria-current={item.current ? 'page' : undefined}
                          className={classNames(
                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a
                    href="/frontend/peopleNews"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    个人信息
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    设置
                  </a>
                </MenuItem>
                <Menu.Item>
                {({ active }) => (
                  <a
                    href="#" // 可以保留 href，避免控制台警告
                    onClick={(e) => {
                      e.preventDefault(); // 阻止默认跳转行为
                      isLoggedIn ? handleLogout() : handleLogin(); // 执行自定义登录/退出逻辑
                    }}
                    className={`block w-full px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                  >
                    {isLoggedIn ? '退出' : '登录'}
                  </a>
                )}
              </Menu.Item>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
            {/* 页面内容 */}
            <main>{children}</main>
            
          </div>
    </>
  );
};

export default Layout;
