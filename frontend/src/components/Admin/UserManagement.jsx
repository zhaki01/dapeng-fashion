// UserManagement.jsx
// 用户管理组件
// 该组件用于显示和管理用户，包括姓名、邮箱、角色等
// 该组件使用了 Redux 来管理状态，并使用了 React Router 来处理路由
// 该组件使用了 useEffect 来获取用户数据，并在组件加载时进行数据请求
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../redux/slices/adminSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    if (user && user.role !== "管理员") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "管理员") {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "客户",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(formData));
    setFormData({ name: "", email: "", password: "", role: "客户" });
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ id: userId, role: newRole }));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("确定要删除该用户吗？")) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#1F7D53] mb-6">用户管理</h2>
      {loading && <p>加载中...</p>}
      {error && <p className="text-red-500">错误: {error}</p>}

      {/* 添加新用户 */}
      <div className="p-6 rounded-xl bg-white shadow mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">添加新用户</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">姓名</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">邮箱</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">密码</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">角色</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
            >
              <option value="客户">客户</option>
              <option value="管理员">管理员</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-[#1F7D53] text-white py-2 px-6 rounded hover:bg-[#255F38] transition"
          >
            添加用户
          </button>
        </form>
      </div>

      {/* 用户列表 */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="py-3 px-4">姓名</th>
              <th className="py-3 px-4">邮箱</th>
              <th className="py-3 px-4">角色</th>
              <th className="py-3 px-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    <option value="客户">客户</option>
                    <option value="管理员">管理员</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
