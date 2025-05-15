// UserManagement.jsx
// 📁 后台用户管理页面组件
// 说明：管理员使用本页面可以查看、添加、修改、删除用户账号，包括姓名、邮箱、角色。
// 使用 Redux 管理用户数据，用 React Router 实现权限控制。

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// ✅ 引入用户管理相关操作：获取、添加、更新角色、删除
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../redux/slices/adminSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ 从 Redux 获取当前登录用户信息
  const { user } = useSelector((state) => state.auth);
  // ✅ 从 Redux 获取用户列表、加载状态和错误信息
  const { users, loading, error } = useSelector((state) => state.admin);

  // ✅ 若不是管理员，则跳转回首页（权限控制）
  useEffect(() => {
    if (user && user.role !== "管理员") {
      navigate("/");
    }
  }, [user, navigate]);

  // ✅ 页面加载后拉取所有用户数据
  useEffect(() => {
    if (user && user.role === "管理员") {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  // ✅ 本地状态：新增用户的表单数据
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "客户", // 默认角色为“客户”
  });

  // ✅ 表单输入变更处理函数
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ 表单提交处理（添加新用户）
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(formData)); // 调用 Redux 添加用户
    // 重置表单
    setFormData({ name: "", email: "", password: "", role: "客户" });
  };

  // ✅ 修改用户角色
  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ id: userId, role: newRole }));
  };

  // ✅ 删除用户操作
  const handleDeleteUser = (userId) => {
    if (window.confirm("确定要删除该用户吗？")) {
      dispatch(deleteUser(userId));
    }
  };

  // ✅ 页面渲染结构
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#1F7D53] mb-6">用户管理</h2>

      {/* ✅ 加载或错误提示 */}
      {loading && <p>加载中...</p>}
      {error && <p className="text-red-500">错误: {error}</p>}

      {/* ✅ 添加新用户表单区域 */}
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

          {/* ✅ 提交按钮 */}
          <button
            type="submit"
            className="bg-[#1F7D53] text-white py-2 px-6 rounded hover:bg-[#255F38] transition"
          >
            添加用户
          </button>
        </form>
      </div>

      {/* ✅ 用户列表展示表格 */}
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
            {/* ✅ 渲染每位用户 */}
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="p-4">{user.email}</td>

                {/* ✅ 角色下拉框（可修改） */}
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

                {/* ✅ 删除按钮 */}
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

// ✅ 导出组件
export default UserManagement;
