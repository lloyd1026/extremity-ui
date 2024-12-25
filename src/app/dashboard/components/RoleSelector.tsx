import { useState, useEffect } from "react";
import request from "@/utils/request";

// 要和返回体中的字段保持一致
interface Role {
  idRole: number;
  name: string;
}

interface RoleDropdownProps {
  selectedRoleId: string;
  onRoleChange: (roleId: string) => void;
}

const RoleDropdown = ({ selectedRoleId, onRoleChange }: RoleDropdownProps) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await request.get("admin/simple-roles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setRoles(response.data.data);
          console.log("更新后的 roles:", response.data.data); // 验证 roles
        } else {
          setError("无法加载角色数据");
        }
      } catch (error) {
        console.log(error);
        setError("请求角色数据时出错");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <select
      value={selectedRoleId}
      onChange={(e) => onRoleChange(e.target.value)} // 返回选中的 idRole
      className="px-4 py-2 border bg-purple-300 text-white rounded-md"
    >
      {roles.map((role) => (
        <option key={role.idRole} value={role.idRole}>
          {role.name}
        </option>
      ))}
    </select>
  );
};

export default RoleDropdown;