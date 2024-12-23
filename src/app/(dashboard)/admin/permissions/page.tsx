import PermissionForm from '@/app/(dashboard)/components/PermissionForm';

const PermissionsPage = () => {
    return (
      <div className="flex flex-col h-screen">
  
        {/* Main Content */}
        <div
          className={`flex-1 p-4 transition-all duration-300 ease-in-out`}
        >
          <h1>用户权限管理界</h1>
          
          <PermissionForm/>
        </div>
      </div>
    );
  };
  
  export default PermissionsPage;