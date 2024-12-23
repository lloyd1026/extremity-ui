import React from 'react'; // 确保显式导入 React
import UserList from '@/app/dashboard/components/UserList';

const UsersPage = () => {
    return (
        <div className="flex h-screen">
    
          {/* Main Content */}
          <div
            className={`flex-1 p-4 transition-all duration-300 ease-in-out`}
          >
            <UserList />
          </div>
        </div>
      );
};

export default UsersPage;