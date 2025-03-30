// AdminHomePage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);
  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#1F7D53] mb-6">管理总览</h1>
      {productsLoading || ordersLoading ? (
        <p>加载中...</p>
      ) : productsError ? (
        <p className="text-red-500">加载商品失败: {productsError}</p>
      ) : ordersError ? (
        <p className="text-red-500">加载订单失败: {ordersError}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">总收入</h2>
            <p className="text-3xl font-bold text-[#27391C]">
              ￥{totalSales.toFixed(2)}
            </p>
          </div>
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
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-[#255F38]">最近订单</h2>
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="py-3 px-4">订单编号</th>
                <th className="py-3 px-4">用户</th>
                <th className="py-3 px-4">订单金额</th>
                <th className="py-3 px-4">状态</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
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

export default AdminHomePage;
