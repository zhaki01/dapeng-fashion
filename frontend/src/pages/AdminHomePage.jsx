// AdminHomePage.jsx
// 管理员首页（仪表盘页面）
// 展示：总收入、订单总数、商品总数、最近订单表格

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // 引入 Redux Hooks
import { Link } from "react-router-dom"; // 用于页面跳转
import { fetchAdminProducts } from "../redux/slices/adminProductSlice"; // 异步获取商品数据
import { fetchAllOrders } from "../redux/slices/adminOrderSlice"; // 异步获取订单数据

const AdminHomePage = () => {
  const dispatch = useDispatch(); // 获取 dispatch 方法，用于触发异步请求

  // 从 Redux 中获取商品相关状态
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);

  // 从 Redux 中获取订单相关状态
  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  // 页面加载时执行，只调用一次：获取商品和订单数据
  useEffect(() => {
    dispatch(fetchAdminProducts()); // 获取商品列表
    dispatch(fetchAllOrders()); // 获取所有订单数据
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 页面标题 */}
      <h1 className="text-3xl font-bold text-[#1F7D53] mb-6">管理总览</h1>

      {/* 加载中、错误处理或展示数据区块 */}
      {productsLoading || ordersLoading ? (
        <p>加载中...</p> // 显示加载状态
      ) : productsError ? (
        <p className="text-red-500">加载商品失败: {productsError}</p> // 显示商品加载错误
      ) : ordersError ? (
        <p className="text-red-500">加载订单失败: {ordersError}</p> // 显示订单加载错误
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 总销售额卡片 */}
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">总收入</h2>
            <p className="text-3xl font-bold text-[#27391C]">
              ￥{totalSales.toFixed(2)}
            </p>
          </div>

          {/* 订单总数卡片 */}
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              订单总数
            </h2>
            <p className="text-3xl font-bold text-[#27391C]">{totalOrders}</p>
            <Link
              to="/admin/orders"
              className="text-[#1F7D53] text-sm mt-2 inline-block hover:underline"
            >
              查看订单管理
            </Link>
          </div>

          {/* 商品总数卡片 */}
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              商品总数
            </h2>
            <p className="text-3xl font-bold text-[#27391C]">
              {products.length}
            </p>
            <Link
              to="/admin/products"
              className="text-[#1F7D53] text-sm mt-2 inline-block hover:underline"
            >
              查看商品管理
            </Link>
          </div>
        </div>
      )}

      {/* 最近订单表格 */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-[#255F38]">最近订单</h2>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-left text-sm text-gray-700">
            {/* 表头 */}
            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="py-3 px-4">订单编号</th>
                <th className="py-3 px-4">用户</th>
                <th className="py-3 px-4">订单金额</th>
                <th className="py-3 px-4">状态</th>
              </tr>
            </thead>

            {/* 表体 */}
            <tbody>
              {orders.length > 0 ? (
                // 有订单时渲染每一条订单记录
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.user?.name}</td>
                    <td className="p-4">￥{order.totalPrice.toFixed(2)}</td>
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                // 无订单提示
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    暂无最近订单
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage; // 导出组件供其他页面调用
