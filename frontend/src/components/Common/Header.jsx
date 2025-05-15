// Header.jsx
// ✅ 网站头部组件（Header）
// 该组件用于构建电商网站顶部区域，包含顶部提示栏 Topbar 和主导航栏 Navbar。
// 通常会显示欢迎语、搜索、分类菜单、Logo、购物车等模块入口。

import Topbar from "../Layout/Topbar"; // 引入顶部提示栏组件
import Navbar from "./Navbar"; // 引入主导航栏组件

const Header = () => {
  return (
    <header className="border-b border-gray-200">
      {/* ✅ Topbar：显示顶部通知/语言/登录信息等 */}
      <Topbar />

      {/* ✅ Navbar：显示网站导航栏，包括 logo、导航链接、购物车等 */}
      <Navbar />

      {/* 🚧 Cart Drawer（购物车侧边抽屉）预留位置，暂未实现 */}
    </header>
  );
};

// ✅ 导出 Header 组件
export default Header;
