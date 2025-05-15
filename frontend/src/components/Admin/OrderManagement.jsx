// OrderManagement.jsx
// 📁 后台订单管理组件
// 说明：该组件用于管理员查看并管理所有用户的订单，包括订单编号、客户、总额、状态修改等操作。
// 使用 Redux 获取订单列表，支持修改订单状态，使用 React Router 进行权限控制与跳转。

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux 状态管理 Hook
import { useNavigate } from "react-router-dom"; // 用于页面跳转

// ✅ 从 adminOrderSlice 中引入获取订单和更新状态的方法
import {
  fetchAllOrders, // 获取所有订单
  updateOrderStatus, // 修改订单状态
} from "../../redux/slices/adminOrderSlice";

const OrderManagement = () => {
  const dispatch = useDispatch(); // 用于分发 action
  const navigate = useNavigate(); // 用于页面跳转

  // ✅ 从 Redux 中获取当前登录用户信息
  const { user } = useSelector((state) => state.auth);
  // ✅ 获取订单状态：订单数据、加载状态、错误信息
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  // ✅ 页面加载后检查权限并获取订单数据
  useEffect(() => {
    if (!user || user.role !== "管理员") {
      navigate("/"); // 非管理员直接跳转回首页
    } else {
      dispatch(fetchAllOrders()); // 拉取所有订单数据
    }
  }, [dispatch, user, navigate]);

  // ✅ 订单状态变更处理函数（下拉框或按钮触发）
  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  // ✅ 加载或报错提示
  if (loading) return <p>加载中...</p>;
  if (error) return <p className="text-red-500">错误: {error}</p>;

  // ✅ 页面主结构：表格展示订单
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#1F7D53] mb-6">订单管理</h2>

      {/* 表格容器 */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="py-3 px-4">订单编号</th>
              <th className="py-3 px-4">客户姓名</th>
              <th className="py-3 px-4">订单总额</th>
              <th className="py-3 px-4">订单状态</th>
              <th className="py-3 px-4">操作</th>
            </tr>
          </thead>

          <tbody>
            {/* ✅ 有订单时渲染每一行 */}
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id} {/* 显示订单ID */}
                  </td>
                  <td className="p-4">{order.user.name}</td> {/* 客户名 */}
                  <td className="p-4">￥{order.totalPrice.toFixed(2)}</td>{" "}
                  {/* 总额 */}
                  {/* ✅ 下拉框修改订单状态 */}
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#1F7D53] focus:border-[#1F7D53] block p-2.5"
                    >
                      <option value="处理中">处理中</option>
                      <option value="已发货">已发货</option>
                      <option value="已送达">已送达</option>
                      <option value="已取消">已取消</option>
                    </select>
                  </td>
                  {/* ✅ 快捷按钮将订单标记为“已送达” */}
                  <td className="p-4">
                    <button
                      onClick={() => handleStatusChange(order._id, "已送达")}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      标记为已送达
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // ✅ 没有订单时的提示行
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  暂无订单。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ✅ 导出组件
export default OrderManagement;
