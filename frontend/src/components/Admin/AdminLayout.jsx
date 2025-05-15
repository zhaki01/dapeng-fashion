// AdminLayout.jsx
// 📁 管理后台页面通用布局组件
// 说明：该组件负责构建后台管理系统的整体布局结构，包括：
// - 左侧导航栏（AdminSidebar）
// - 顶部移动端按钮（汉堡菜单）
// - 主内容区域（Outlet 显示嵌套路由内容）
// - 支持移动端导航栏展开/关闭

// ✅ 引入所需的库和组件
import { useState } from "react"; // 用于控制 sidebar 开关状态
import { FaBars } from "react-icons/fa"; // 引入汉堡菜单图标
import AdminSidebar from "./AdminSidebar"; // 左侧导航栏组件
import { Outlet } from "react-router-dom"; // React Router 中的嵌套路由占位符

// ✅ 布局组件定义
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 控制侧边栏是否展开（移动端）

  // 切换侧边栏状态（点击汉堡按钮触发）
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ✅ 返回 UI 结构
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative bg-[#F5F6F5]">
      {/* ✅ 移动端顶部栏（含菜单按钮和标题） */}
      <div className="flex md:hidden p-4 bg-[#27391C] text-white z-20">
        <button onClick={toggleSidebar}>
          <FaBars size={24} /> {/* 汉堡菜单图标 */}
        </button>
        <h1 className="ml-4 text-xl font-semibold tracking-wide">管理后台</h1>
      </div>

      {/* ✅ 移动端遮罩层（点击关闭侧边栏） */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-40 md:hidden"
          onClick={toggleSidebar} // 点击遮罩关闭菜单
        ></div>
      )}

      {/* ✅ 左侧导航栏容器 */}
      <div
        className={`bg-[#1F7D53] w-64 min-h-screen text-white absolute md:relative transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}
      >
        {/* 渲染侧边栏组件内容 */}
        <AdminSidebar />
      </div>

      {/* ✅ 主内容区域 */}
      <div className="flex-grow p-6 overflow-auto">
        {/* Outlet 用于渲染当前匹配的子路由页面内容 */}
        <Outlet />
      </div>
    </div>
  );
};

// ✅ 导出该布局组件
export default AdminLayout;
