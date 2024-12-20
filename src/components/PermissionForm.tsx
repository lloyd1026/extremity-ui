// src/app/dashboard/admin/components/PermissionForm.tsx
import { useState } from 'react';

const PermissionForm = () => {
  const [selectedRole, setSelectedRole] = useState<string>('User');

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };

  return (
    <div>
      <h3>权限管理</h3>
      <form>
        <label>
          选择角色:
          <select value={selectedRole} onChange={handleRoleChange}>
            <option value="Admin">管理员</option>
            <option value="Editor">编辑</option>
            <option value="User">普通用户</option>
          </select>
        </label>
        <button type="submit">保存</button>
      </form>
    </div>
  );
};

export default PermissionForm;