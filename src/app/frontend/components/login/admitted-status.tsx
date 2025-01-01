'use client'; // 确保这是一个 Client Component
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import request from "@/utils/request";
const AdmittedStatus = () => {
  const [email, setEmail] = useState('');
  const [status,setStatus] = useState<number>();
  const router = useRouter();
  const handleAdmitted = async () => {
    // 在这里模拟登录验证
    const response = await request.get(`/user/role`,{params:{email:email}})
    if(response.data.success){
        setStatus(response.data.data)
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleAdmitted(); // 按下 Enter 键时触发登录事件
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            action="#"
            method="POST"
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault(); // 防止默认表单提交
              handleAdmitted(); // 在表单提交时触发登录
            }}
          >
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                邮箱
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // 绑定到 username
                  onKeyDown={handleKeyDown} // 绑定 handleKeyDown
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            {status && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">您的申请状态为:</p>
              <p className="text-lg font-semibold text-indigo-600">
              {status === 1 ? '已通过' : status === 0 ? '审核中' : '未通过'}
              </p>
            </div>
          )}
            <div>
              <button
                type="submit" // 按钮类型为 submit
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                查看申请状态
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </>
  );
};

export default AdmittedStatus;
