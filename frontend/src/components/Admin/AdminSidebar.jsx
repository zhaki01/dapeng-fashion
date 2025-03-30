// AdminSidebar.jsx
// AdminSidebar.jsx
// 管理后台侧边栏组件
// 该组件用于显示管理后台的侧边栏，包含导航链接和退出登录按钮
// 该组件使用了 React Router 的 NavLink 组件来实现导航链接
import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaUser,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/admin"
          className="text-2xl font-bold tracking-wide text-white"
        >
          鹏衣有道
        </Link>
      </div>
      <h2 className="text-lg font-semibold mb-6 text-center text-[#F2F2F2]">
        后台管理系统
      </h2>

      <nav className="flex flex-col space-y-2">
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

        {/* // 在 AdminSidebar.jsx 中，在 <nav> 部分添加 */}
        <NavLink
          to="/admin/user-statistics"
          className={({ isActive }) =>
            isActive
              ? "bg-[#255F38] text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-200 hover:bg-[#255F38] hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaClipboardList /> {/* 可替换成其他图标 */}
          <span>用户统计</span>
        </NavLink>

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
export default AdminSidebar;
