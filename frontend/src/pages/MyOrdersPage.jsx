// MyOrdersPage component
// MyOrdersPage.jsx
// 我的订单页面：展示当前用户所有订单列表，并支持点击查看详情

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { useNavigate } from "react-router-dom"; // 路由跳转 hook
import { fetchUserOrders } from "../redux/slices/orderSlice"; // 异步 action：获取用户订单列表

const MyOrdersPage = () => {
  const navigate = useNavigate(); // 页面跳转函数
  const dispatch = useDispatch(); // Redux 派发函数

  // 从 Redux 中获取订单状态
  const { orders, loading, error } = useSelector((state) => state.orders);

  // 页面加载时请求订单数据
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // 点击某一行跳转到订单详情页
  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // 加载状态提示
  if (loading) return <p>加载中...</p>;

  // 错误状态提示
  if (error) return <p>错误：{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* 页面标题 */}
      <h2 className="text-xl sm:text-2xl font-bold text-[#1F7D53] mb-6">
        我的订单
      </h2>

      {/* 表格展示订单列表 */}
      <div className="relative shadow-md sm:rounded-lg overflow-hidden">
        <table className="min-w-full text-left text-gray-600">
          {/* 表头 */}
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-2 px-4 sm:py-3">商品图</th>
              <th className="py-2 px-4 sm:py-3">订单编号</th>
              <th className="py-2 px-4 sm:py-3">下单时间</th>
              <th className="py-2 px-4 sm:py-3">收货地址</th>
              <th className="py-2 px-4 sm:py-3">商品数量</th>
              <th className="py-2 px-4 sm:py-3">总金额</th>
              <th className="py-2 px-4 sm:py-3">支付状态</th>
            </tr>
          </thead>

          {/* 表体：订单列表 */}
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)} // 点击跳转详情页
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  {/* 商品缩略图（展示第一个商品） */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                  </td>

                  {/* 订单编号 */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>

                  {/* 下单时间 */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>

                  {/* 收货地址 */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "无"}
                  </td>

                  {/* 商品数量 */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.orderItems.length}
                  </td>

                  {/* 订单总金额 */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    ¥{order.totalPrice}
                  </td>

                  {/* 支付状态（颜色标识） */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <span
                      className={`${
                        order.isPaid
                          ? "bg-[#E6F4EA] text-[#1F7D53]"
                          : "bg-[#FDECEA] text-[#D93025]"
                      } px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                    >
                      {order.isPaid ? "已支付" : "未支付"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              // 无订单记录提示
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  暂无订单记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage; // 导出我的订单页面组件
