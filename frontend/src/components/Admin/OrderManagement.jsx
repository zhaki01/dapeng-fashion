// OrderManagement.jsx
// 订单管理组件
// 该组件用于显示和管理订单，包括订单编号、客户姓名、订单总额、订单状态等
// 该组件使用了 Redux 来管理状态，并使用了 React Router 来处理路由
// 该组件使用了 useEffect 来获取订单数据，并在组件加载时进行数据请求
// 该组件使用了 useDispatch 和 useSelector 来与 Redux 进行交互
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../redux/slices/adminOrderSlice";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (!user || user.role !== "管理员") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  if (loading) return <p>加载中...</p>;
  if (error) return <p className="text-red-500">错误: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#1F7D53] mb-6">订单管理</h2>

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
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="p-4">{order.user.name}</td>
                  <td className="p-4">￥{order.totalPrice.toFixed(2)}</td>
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

export default OrderManagement;

// 该组件使用了 useNavigate 来进行路由跳转
// 该组件使用了 useState 来管理组件的状态
// 该组件使用了 useEffect 来处理副作用
// 该组件使用了 useSelector 来获取 Redux 中的状态
// 该组件使用了 useDispatch 来分发 Redux 的 action
// 该组件使用了 useNavigate 来进行路由跳转
// 该组件使用了 useState 来管理组件的状态
// 该组件使用了 useEffect 来处理副作用
