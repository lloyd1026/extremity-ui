import { useState, useEffect } from 'react';
import request from '@/utils/request';

interface User {
  idUser: number;
  nickName: string;
  email: string;
}

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountDeletionModal = ({ isOpen, onClose }: AccountDeletionModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeleteUsers = async () => {
    setLoading(true);
    try {
      const response = await request.get('team-admin/get-delete-users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError('无法加载用户数据');
      }
    } catch (error) {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDeleteUsers();
    }
  }, [isOpen]);

  const handleDeleteApproval = async (userId: number) => {
    try {
      const response = await request.get('team-admin/delete-user',{
            params: { idUser: userId },
        }
      );

      if (response.data.success) {
        alert('注销申请已通过');
        fetchDeleteUsers(); // 刷新用户列表
      } else {
        alert('操作失败');
      }
    } catch (error) {
      alert('网络错误');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">账号注销申请</h3>

        {loading ? (
          <div>加载中...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div>
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.idUser} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <p>{user.nickName} ({user.email})</p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDeleteApproval(user.idUser)}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      同意
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>没有注销申请。</p>
            )}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-300 rounded-md hover:bg-gray-400"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletionModal;