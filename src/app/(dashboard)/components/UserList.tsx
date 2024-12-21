"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import request from '@/utils/request';

interface User {
  idUser: number;
  account: string;
  nickname: string;
  avatarUrl: string;
  email: string;
  phone?: string;
  signature?: string;
}

const UserList = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('1');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const usersPerPage = 10;

  const fetchUsers = async (roleIds: string, page: number) => {
    setLoading(true);
    try {
      // const response = await axios.get(`http://localhost:8080/extremity/api/admin/user/get-by-role-ids?ids=${roleIds}`, {
      const response = await request.get(`admin/user/get-by-role-ids`,{
        params: { ids: roleIds },  // 使用 params 来传递查询参数
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success && Array.isArray(response.data.data[selectedRoleId])) {
        const users = response.data.data[selectedRoleId];
        setTotalUsers(users.length);
        const usersToShow = users.slice((page - 1) * usersPerPage, page * usersPerPage);
        setUserList(usersToShow);
      } else {
        setUserList([]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError('无法加载用户数据');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(selectedRoleId, currentPage);
  }, [selectedRoleId, currentPage]);

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: number) => {
    console.log(`Edit user with id ${id}`);
  };

  const handleDelete = (id: number) => {
    setUserList(userList.filter(user => user.idUser !== id));
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div>
      <h3>团队管理员 管理</h3>

      <div className="mb-4">
        <label htmlFor="role-select" className="mr-2">选择角色:</label>
        <div className="relative flex space-x-4 pb-4 overflow-x-auto w-full max-w-full">
          {/* 角色按钮 */}
          <button
            onClick={() => handleRoleChange('1')}
            className={`px-6 py-3 rounded-lg ${selectedRoleId === '1' ? 'bg-purple-300 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-purple-400 transition-colors duration-300`}
          >
            超级管理员
          </button>
          <button
            onClick={() => handleRoleChange('2')}
            className={`px-6 py-3 rounded-lg ${selectedRoleId === '2' ? 'bg-purple-300 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-purple-400 transition-colors duration-300`}
          >
            团队管理员
          </button>
          <button
            onClick={() => handleRoleChange('3')}
            className={`px-6 py-3 rounded-lg ${selectedRoleId === '3' ? 'bg-purple-300 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-purple-400 transition-colors duration-300`}
          >
            团队成员
          </button>
          <button
            onClick={() => handleRoleChange('4')}
            className={`px-6 py-3 rounded-lg ${selectedRoleId === '4' ? 'bg-purple-300 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-purple-400 transition-colors duration-300`}
          >
            普通用户
          </button>
          {/* 底部的滑动框 */}
          {/* <div className={`absolute bottom-0 left-0 h-1 w-1/4 bg-purple-500 transition-transform duration-300 ${selectedRoleId === '1' ? 'transform translate-x-0' : selectedRoleId === '2' ? 'transform translate-x-1/4' : selectedRoleId === '3' ? 'transform translate-x-2/4' : 'transform translate-x-3/4'}`} /> */}
        </div>
      </div>

      <div className="space-y-4">
        {userList.map(user => (
          <div key={user.idUser} className="flex items-center p-6 border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-300">
            <Image
              src={user.avatarUrl || '/images/default-avatar.jpg'}
              alt="Avatar"
              width={48}   // 指定宽度
              height={48}  // 指定高度
              className="w-16 h-16 rounded-full mr-6"
            />

            <div className="flex flex-row space-x-2">
              <h4 className="text-lg font-semibold">{user.nickname}</h4>
              <p className="text-sm text-gray-600">{user.account}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>电话:</strong> {user.phone || '暂无'}</p>
              <p><strong>签名:</strong> {user.signature || '暂无'}</p>
            </div>
            
            <div className="flex space-x-4 mr-10">
              <button
                onClick={() => handleEdit(user.idUser)}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transform transition-all duration-200"
              >
                编辑
              </button>
              <button
                onClick={() => handleDelete(user.idUser)}
                className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transform transition-all duration-200"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400 disabled:opacity-50"
        >
          上一页
        </button>
        <span className="px-4 py-2 text-gray-700">
          第 {currentPage} 页 / 共 {totalPages} 页
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400 disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
};

export default UserList;