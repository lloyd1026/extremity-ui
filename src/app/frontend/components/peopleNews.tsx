import config from '@/config/baseurl_config';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { Praise } from 'next/font/google';
import { useEffect, useState } from 'react';
import request from "@/utils/request";
import { User } from './info';

const PeopleNews = () => {
  const [image, setImage] = useState<File | null>(null); // 存储选择的图片
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 存储预览图片的URL
  const [account, setAccount] = useState<string>(''); // 存储姓名
  const [name, setName] = useState<string>(''); // 存储姓名
  const [gender, setGender] = useState<string>(''); // 存储性别
  const [phone, setPhone] = useState<string>(''); // 存储电话号码
  const [user,setUser] = useState<User |null>(null);
  const storedUser = localStorage.getItem("user");

  if(storedUser==null){
    return null
  }
  const parseuser:User = JSON.parse(storedUser);
  // 处理图片选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImagePreview(fileReader.result as string); // 设置图片预览
      };
      fileReader.readAsDataURL(file); // 读取图片文件为Data URL
    }
  };

  // 向后端发送头像、姓名、性别和电话号码
  const handleSave = async () => {
    const formData = new FormData();
    if (image) {
      formData.append('file', image); // 将图片文件添加到FormData
    }
    if (user?.email) {
      formData.append('email', user.email);
    }
    formData.append('account', account); // 添加姓名到FormData
    formData.append('name', name); // 添加姓名到FormData
    formData.append('sex', gender); // 添加性别到FormData
    formData.append('phone', phone); // 添加电话号码到FormData
    console.log(user)
    const response = await request.post('/user/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      alert('添加成功');
    } else {
      alert('添加失败');
    }
  };
  useEffect(()=>{
    const fetchUser = async()=>{
      const response = await request.get(`/user/email`,{params:{email:parseuser.email}})
      if(response.data.success){
        setUser(response.data.data);
        if (response.data.data.avatarUrl) {
          setImagePreview(`${config.imageUrl}${response.data.data.avatarUrl}`);
        }
      }
      
    }
    fetchUser();
  },[]);
  return (
    <div className="max-w-xl mx-auto p-6">
      {/* 头像部分 */}
      <div className="col-span-full">
        <label htmlFor="photo" className="block text-sm font-medium text-gray-900">
          头像
        </label>
        <div className="mt-2 flex justify-center items-center gap-x-3">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Avatar Preview"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon aria-hidden="true" className="h-24 w-24 text-gray-300" />
          )}
        </div>
      </div>

      {/* 上传文件部分 - 调整大小 */}
      <div className="col-span-full mt-6">
        <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-900">
          修改头像
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-1.5 py-2">
          <div className="text-center">
            <PhotoIcon aria-hidden="true" className="mx-auto h-10 w-10 text-gray-300" />
            <div className="mt-4 flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>上传文件</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="p1-1">PNG, JPG, GIF 最大10MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* 姓名输入部分 */}
      <div className="col-span-full mt-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-900">
          用户名
        </label>
        <input
          type="text"
          id="account"
          name="account"
          value={account||user?.account||""}
          onChange={(e) => setAccount(e.target.value)}
          className="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="请输入您的用户名"
        />
      </div>

      {/* 姓名输入部分 */}
      <div className="col-span-full mt-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-900">
          姓名
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name||user?.realName||""}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="请输入您的姓名"
        />
      </div>

      {/* 性别输入部分 */}
      <div className="col-span-full mt-6">
        <label htmlFor="gender" className="block text-sm font-medium text-gray-900">
          性别
        </label>
        <select
          id="gender"
          name="gender"
          value={gender||user?.sex||""}
          onChange={(e) => setGender(e.target.value)}
          className="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">请选择性别</option>
          <option value="1">男</option>
          <option value="0">女</option>
        </select>
      </div>

      {/* 电话号码输入部分 */}
      <div className="col-span-full mt-6">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
          电话号码
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone||user?.phone||""}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="请输入您的电话号码"
        />
      </div>

      {/* 保存按钮 */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default PeopleNews;
