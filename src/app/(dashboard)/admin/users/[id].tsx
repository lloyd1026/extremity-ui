"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // 用来获取路由中的参数
import axios from 'axios';

const UserDetail = () => {
  const router = useRouter();
  const { id } = router.query; // 获取路由中的用户id
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取用户详细信息
  useEffect(() => {
    if (id) {
      const fetchUserDetail = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/${id}`);
          setUser(response.data);
          setLoading(false);
        } catch (error) {
          setError('无法加载用户详细信息');
          setLoading(false);
        }
      };

      fetchUserDetail();
    }
  }, [id]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>找不到该用户</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold mb-4">用户详细信息</h3>
      <div className="p-4 border rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <img src={user.avatar || '/default-avatar.png'} alt="头像" className="w-24 h-24 rounded-full" />
          <div>
            <p className="text-xl font-medium">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">用户详细描述</h4>
          <p>{user.description || '没有描述'}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;