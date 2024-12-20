"use client";
import { useState, useEffect } from 'react'; // 命名导出 需要使用 {} 来指定需要导入的具体内容|| react提供的两个hook
import Link from 'next/link'; // 用来实现路由跳转
import axios from 'axios';  // 默认导出

interface User {
  id: number;
  account: string;
  nickname: string;
  sex: string;
  avatar_url: string;
  email: string;
  phone: string;
  status: string;
  created_time: string;
  updated_time: string;
  signature: string;
  last_login_time: string;
  last_online_time: string;
  bg_img_url: string;
}

const UserList = () => {
  const [userList, setUserList] = useState<User[]>([]); // 初始为一个空数组
  const [loading, setLoading] = useState<boolean>(true); // 用于表示数据是否正在加载
  const [error, setError] = useState<string | null>(null); // 用于捕获请求错误

  // 使用 useEffect 来进行 API 请求,hook
  useEffect(() => {
    // const fetchUsers = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:5000/api/users');
    //     setUserList(response.data); // 假设返回的数据是一个用户数组
    //     setLoading(false); // 请求成功后设置 loading 为 false
    //   } catch (error) {
    //     setError('无法加载用户数据'); // 错误处理
    //     setLoading(false); // 请求失败后设置 loading 为 false
    //   }
    // };

    // fetchUsers();

    // 这里直接使用模拟的 JSON 数据
    const simulatedData: User[] = [
      {
        id: 1,
        account: 'admin',
        nickname: '超级管理员',
        sex: '0',
        avatar_url: '/images/1.jpg',
        email: 'admin@example.com',
        phone: '12345678901',
        status: '1',
        created_time: '2024-01-01 12:00:00',
        updated_time: '2024-01-01 12:00:00',
        signature: '欢迎使用系统',
        last_login_time: '2024-01-01 12:00:00',
        last_online_time: '2024-01-01 12:00:00',
        bg_img_url: '/default-bg.png',
      },
      {
        id: 2,
        account: 'user1',
        nickname: '用户1',
        sex: '1',
        avatar_url: '/images/default-avatar.jpg',
        email: 'user1@example.com',
        phone: '12345678902',
        status: '1',
        created_time: '2024-01-02 12:00:00',
        updated_time: '2024-01-02 12:00:00',
        signature: '我是用户1',
        last_login_time: '2024-01-02 12:00:00',
        last_online_time: '2024-01-02 12:00:00',
        bg_img_url: '/default-bg.png',
      },
      // 你可以继续添加其他用户数据
    ];
    // 模拟成功加载数据
    setUserList(simulatedData);
    setLoading(false);

  }, []); // 只在组件首次渲染时执行一次

  const handleEdit = (id: number) => {
    // 可以添加编辑用户的逻辑
    console.log(`Edit user with id ${id}`);
  };

  const handleDelete = (id: number) => {
    // 删除用户的逻辑，可以在前端删除，或者发送删除请求到后端
    setUserList(userList.filter(user => user.id !== id));
    // 你可以在这里调用后端删除 API 来同步删除操作
    // axios.delete(`http://localhost:5000/api/users/${id}`);
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>团队管理员 管理</h3>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2">头像</th>
            <th className="px-4 py-2">用户名</th>
            <th className="px-4 py-2">真实姓名</th>
            <th className="px-4 py-2">邮箱</th>
            <th className="px-4 py-2">电话</th>
            <th className="px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(user => (
            <tr key={user.id}>
            <td className="px-4 py-2">
              <img src={user.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full" />
            </td>
            <td className="px-4 py-2">{user.nickname}</td>
            <td className="px-4 py-2">{user.account}</td>
            <td className="px-4 py-2">{user.email}</td>
            <td className="px-4 py-2">{user.phone}</td>
            <td className="px-4 py-2">
              <button onClick={() => handleEdit(user.id)} className="bg-blue-500 text-white px-4 py-2 rounded">编辑</button>
              <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">删除</button>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;