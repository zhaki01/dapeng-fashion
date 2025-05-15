// AdminSidebar.jsx
// 📁 后台管理侧边栏组件
// 说明：本组件用于构建后台页面的左侧导航栏，包含导航链接和退出登录按钮，适用于管理员操作后台功能模块。
// 使用 React Router 的 NavLink 控制页面跳转，并高亮当前激活页面。

// ✅ 引入所需图标组件和库
import {
  FaBoxOpen, // 商品图标
  FaClipboardList, // 表单或统计图标（用于订单/统计）
  FaSignOutAlt, // 退出登录图标
  FaStore, // 商城首页图标
  FaUser, // 用户图标
} from "react-icons/fa";

import { useDispatch } from "react-redux"; // 用于派发 Redux 动作
import { Link, NavLink, useNavigate } from "react-router-dom"; // 导航相关组件
import { logout } from "../../redux/slices/authSlice"; // 用户登出动作
import { clearCart } from "../../redux/slices/cartSlice"; // 清空购物车动作（安全性）

// ✅ 组件定义
const AdminSidebar = () => {
  const navigate = useNavigate(); // React Router 的跳转钩子
  const dispatch = useDispatch(); // Redux 派发函数

  // ✅ 处理退出登录逻辑
  const handleLogout = () => {
    dispatch(logout()); // 退出登录（清除 token）
    dispatch(clearCart()); // 清空购物车数据（避免数据残留）
    navigate("/"); // 跳转回商城首页
  };

  // ✅ 返回完整 JSX 结构
  return (
    <div className="p-6">
      {/* 顶部 Logo 或项目名 */}
      <div className="mb-6">
        <Link
          to="/admin"
          className="text-2xl font-bold tracking-wide text-white"
        >
          鹏衣有道
        </Link>
      </div>

      {/* 标题文字 */}
      <h2 className="text-lg font-semibold mb-6 text-center text-[#F2F2F2]">
        后台管理系统
      </h2>

      {/* ✅ 导航链接区域 */}
      <nav className="flex flex-col space-y-2">
        {/* 用户管理导航项 */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "bg-[#255F38] text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-200 hover:bg-[#255F38] hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaUser />
          <span>用户管理</span>
        </NavLink>

        {/* 用户统计导航项（新增模块） */}
        <NavLink
          to="/admin/user-statistics"
          className={({ isActive }) =>
            isActive
              ? "bg-[#255F38] text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-200 hover:bg-[#255F38] hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaClipboardList />
          <span>用户统计</span>
        </NavLink>

        {/* 商品管理导航项 */}
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "bg-[#255F38] text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-200 hover:bg-[#255F38] hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaBoxOpen />
          <span>商品管理</span>
        </NavLink>

        {/* 订单管理导航项 */}
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "bg-[#255F38] text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-200 hover:bg-[#255F38] hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaClipboardList />
          <span>订单管理</span>
        </NavLink>

        {/* 返回商城首页的入口 */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-[#255F38] text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-200 hover:bg-[#255F38] hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaStore />
          <span>返回商城</span>
        </NavLink>
      </nav>

      {/* ✅ 退出登录按钮区域 */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
        >
          <FaSignOutAlt />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  );
};

// ✅ 导出该组件
export default AdminSidebar;
