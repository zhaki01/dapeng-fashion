// Navbar.jsx
// ✅ 网站导航栏组件
// 用于显示页面顶部的主导航区域，包括 Logo、分类链接、用户图标、购物车图标、搜索栏、移动端菜单等。
// 支持管理员入口、购物车商品数量显示、移动端抽屉菜单等功能。

import { Link } from "react-router-dom"; // 用于页面内部跳转
import {
  HiOutlineUser, // 用户图标
  HiOutlineShoppingBag, // 购物袋图标
  HiBars3BottomRight, // 汉堡菜单图标（移动端菜单按钮）
} from "react-icons/hi2";
import SearchBar from "./SearchBar"; // 搜索栏组件
import CartDrawer from "../Layout/CartDrawer"; // 购物车抽屉组件
import { useState } from "react";
import { IoMdClose } from "react-icons/io"; // 关闭图标
import { useSelector } from "react-redux"; // 用于读取全局 Redux 状态

const Navbar = () => {
  // 控制购物车抽屉是否打开
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 控制移动端导航抽屉是否打开
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const { cart } = useSelector((state) => state.cart); // 获取购物车状态
  const { user } = useSelector((state) => state.auth); // 获取当前用户信息

  // 计算购物车内商品总数（所有商品数量相加）
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  // 切换移动端导航抽屉显示状态
  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  // 切换购物车抽屉显示状态
  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      {/* ✅ 顶部导航条 */}
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* 左侧：Logo */}
        <div>
          <Link to="/" className="text-2xl font-medium">
            鹏衣有道
          </Link>
        </div>

        {/* 中间：分类导航链接（仅在中大屏幕显示） */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=男士"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            男装
          </Link>
          <Link
            to="/collections/all?gender=女士"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            女装
          </Link>
          <Link
            to="/collections/all?category=上装"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            上衣
          </Link>
          <Link
            to="/collections/all?category=下装"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            下装
          </Link>
        </div>

        {/* 右侧：图标区 */}
        <div className="flex items-center space-x-4">
          {/* 如果是管理员，则显示“管理员”按钮 */}
          {user && user.role === "管理员" && (
            <Link
              to="/admin"
              className="block bg-black px-2 rounded text-sm text-white"
            >
              管理员
            </Link>
          )}

          {/* 用户个人中心入口 */}
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          {/* 购物车图标，点击打开购物车抽屉 */}
          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {/* 如果购物车有商品，则显示商品数量 */}
            {cartItemCount > 0 && (
              <span className="absolute -top-1 bg-rabbit-red text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* 搜索栏 */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>

          {/* 移动端汉堡菜单按钮（仅小屏幕显示） */}
          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* ✅ 购物车抽屉组件 */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* ✅ 移动端导航抽屉（滑出式） */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 抽屉顶部关闭按钮 */}
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* 抽屉内导航菜单 */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">导航</h2>
          <nav className="space-y-4">
            <Link
              to="/collections/all?gender=男士"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              男装
            </Link>
            <Link
              to="/collections/all?gender=女士"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              女装
            </Link>
            <Link
              to="/collections/all?category=上装"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              上装
            </Link>
            <Link
              to="/collections/all?category=下装"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              下装
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

// ✅ 导出 Navbar 组件
export default Navbar;
