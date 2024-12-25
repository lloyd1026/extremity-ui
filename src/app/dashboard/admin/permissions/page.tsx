import PermissionForm from '@/app/dashboard/components/admin/PermissionForm';

const PermissionsPage = () => {
    return (
      <div className="flex flex-col h-screen">
        {/* Main Content */}
        <div className="flex-1 p-4 transition-all duration-300 ease-in-out">
          <h1 className="text-center text-4xl font-bold mb-6">团队管理员 权限管理</h1>
          <PermissionForm />
        </div>
      </div>
    );
  };
  
  export default PermissionsPage;