'use client'

import { Fragment, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const navigation = {
  categories: [
    { id: 'monograph', name: '专著', href: '/frontend/classification/1' },
    { id: 'patent', name: '专利', href: '/frontend/classification/2' },
    { id: 'products', name: '产品', href: '/frontend/classification/3' },
    { id: 'soft', name: '软著', href: '/frontend/classification/4' },
    { id: 'essay', name: '文章', href: '/frontend/classification/0' },
  ],
}

export default function Classification({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('essay'); // 默认选中 '文章'

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      onClick={() => setSelectedCategory(category.id)} // 更新选中的分类
                      className={`flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium transition duration-200 ease-out ${
                        selectedCategory === category.id
                          ? 'border-indigo-600 text-indigo-600' // 如果是选中的分类，显示蓝色下划线
                          : 'border-transparent text-gray-900 hover:border-indigo-600 hover:text-indigo-600'
                      }`}
                    >
                      <Link href={category.href}>{category.name}</Link>
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel key={category.name} className="space-y-10 px-4 pb-8 pt-10">
                    <div className="grid grid-cols-2 gap-x-4">
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white z-20">
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* 直接使用 Link 进行分类导航，不需要 Popover */}
              <div className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <div key={category.name} className="flex">
                      <Link
                        href={category.href}
                        className={`relative z-10 flex items-center border-b-2 border-transparent pt-px text-sm font-medium text-gray-700 transition-colors duration-200 ease-out ${
                          selectedCategory === category.id
                            ? 'border-indigo-600 text-indigo-600' // 保持已选中项的下划线
                            : 'hover:border-indigo-600 hover:text-indigo-600'
                        }`}
                        onClick={() => setSelectedCategory(category.id)} // 更新选中的分类
                      >
                        {category.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* 正确渲染 children */}
      <main>{children}</main>
    </div>
  )
}
