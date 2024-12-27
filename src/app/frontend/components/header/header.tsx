'use client'; // 确保这是一个 Client Component

import { usePathname, useRouter } from 'next/navigation'; // 导入 useRouter 进行页面跳转
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon,XMarkIcon } from '@heroicons/react/24/outline'
import request from "@/utils/request";
import { useAuth } from '../auth/authcontext';
import {userwithRoles} from '@/interfaces/userwithRoles'
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import config from '@/config/baseurl_config';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname(); // 获取当前路径
  const { auth } = useAuth() as {auth:userwithRoles|null};

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navigation = [
    { name: '主页', href: '/frontend', current: false },
    { name: '分类', href: '/frontend/classification', current: false },
    { name : '在线论坛',href: '/frontend/comment',current:false},
    { name : '团队信息',href: '/frontend/team',current:false},
  ]

  function classNames(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(' ')
  }

  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: pathname === item.href,  // 比较路径来判断当前项是否选中
  }));

  const handleLogin = ()=>{
    router.push('/frontend/login');
  }

  const handleLogout = async () => {
    await request.post(`/auth/logout`,{})
    sessionStorage.removeItem('userInfo'); // 删除登录状态
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    router.push('/frontend/login'); // 登出后跳转到主页面
   }

   const handleDelete = async () => {
    const isConfirmed = window.confirm('您确定要注销账号吗？');
    if (isConfirmed) {
        const response = await request.get(`/auth/submit-delete`, {params:{idUser: auth?.idUser}});
        
        if(response.data.success){
          alert("您的注销申请已提交至管理员审核");
        }
        // sessionStorage.removeItem('userInfo'); // 删除登录状态
        // localStorage.removeItem('token');
        // localStorage.removeItem('refreshToken');

        // router.push('/frontend/login'); // 登出后跳转到主页面
    } else {
        console.log('用户取消了退出操作');
    }
   }

   const avatar = ()=>{
    if(!isMounted){
      return "/images/default-avatar.jpg"
    }

    if(!auth){
      return "/images/default-avatar.jpg"
    }
    if(auth.avatarUrl&&auth.avatarUrl.length!=0){
      return config.imageUrl+auth.avatarUrl;
    }
      return "/images/default-avatar.jpg"
   }

  return (
    isMounted&&
    <div>
        <div className="relative">
          <Disclosure as="nav" className="bg-slate-400">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">

                  <Disclosure.Button className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                    <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex shrink-0 items-center">
                    <Image
                      alt="Your Company"
                      src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                      className="h-8 w-auto"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {updatedNavigation.map((item) => {
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              aria-current={item.current ? 'page' : undefined}
                              className={classNames(
                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'rounded-md px-3 py-2 text-sm font-medium'
                              )}
                            >
                              {item.name}
                            </Link>
                            )
                    }
                    )
                    }
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3 z-50">
              <div >
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <Image
                    src={avatar()} // 使用 avatarUrl 作为 Image 的 src
                    alt="头像"
                    className="size-8 rounded-full"
                    width={32}
                    height={32}
                  />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <Link
                    href="/frontend/profile"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    设置
                  </Link>
                </MenuItem>
                {auth?.scope[0]==4&&(
                  <MenuItem>
                  <Link
                    href="/frontend/my-comment"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    我的反馈
                  </Link>
                </MenuItem>)}

                <MenuItem>
                {({ active }) => (
                  <Link
                    href="#" // 可以保留 href，避免控制台警告
                    onClick={(e) => {
                      e.preventDefault(); // 阻止默认跳转行为
                      if (auth) {
                        handleLogout();
                      } else {
                        handleLogin();
                      } // 执行自定义登录/退出逻辑
                    }}
                    className={`block w-full px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                  >
                    {auth? '退出' : '登录'}
                  </Link>
                )}
              </MenuItem>

              {auth && (
              <MenuItem>
                {({ active }) => (
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault(); // 阻止默认跳转行为
                      handleDelete(); // 仅在登录状态下执行退出逻辑
                    }}
                    className={`block w-full px-4 py-2 text-sm text-gray-700 ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    注销
                  </Link>
                )}
              </MenuItem>
)}
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
    </div>
    </div>
    );
};

export default Header;
