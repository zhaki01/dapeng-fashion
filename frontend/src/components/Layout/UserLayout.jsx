// UserLayout.jsx component
// ✅ 用户界面通用布局组件
// 本组件作为网站前台用户页面的整体框架，包含头部（Header）、中间内容区（main）、底部（Footer）
// 通过 React Router 的 Outlet 渲染嵌套路由内容，例如商品页、首页、详情页等

import { Outlet } from "react-router-dom"; // 用于渲染当前匹配到的子路由组件
import Footer from "../Common/Footer"; // 导入底部组件
import Header from "../Common/Header"; // 导入头部组件

const UserLayout = () => {
  return (
    <>
      {/* ✅ 网站顶部导航栏（Logo、分类菜单、搜索、购物车等） */}
      <Header />

      {/* ✅ 主体内容区域，由子路由决定实际展示的页面内容 */}
      <main>
        <Outlet />
      </main>

      {/* ✅ 网站底部区域（联系方式、分类、版权信息等） */}
      <Footer />
    </>
  );
};

// ✅ 导出该布局组件，供路由系统使用
export default UserLayout;
