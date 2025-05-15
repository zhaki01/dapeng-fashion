// Desc: Order Confirmation Page
// OrderConfirmationPage.jsx
// 订单确认页：展示订单信息、商品列表、送达时间、支付方式等内容

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { useNavigate } from "react-router-dom"; // 路由跳转 hook
import { clearCart } from "../redux/slices/cartSlice"; // 清空购物车 action

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 从 Redux 中获取结账后的订单信息
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout && checkout._id) {
      // 有有效订单 → 清空购物车
      dispatch(clearCart()); // 清空 Redux 中购物车
      localStorage.removeItem("cart"); // 清除本地缓存购物车
    } else {
      // 若无有效订单 → 跳转至“我的订单”页
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  // 计算预计送达时间（订单时间 + 10 天）
  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString(); // 转为本地日期格式
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* 页面标题 */}
      <h1 className="text-4xl font-bold text-center text-[#1F7D53] mb-10">
        感谢您的订单！
      </h1>

      {/* 若 checkout 存在则渲染订单信息 */}
      {checkout && (
        <div className="p-6 rounded-2xl border shadow-sm bg-white">
          {/* 订单基础信息区块 */}
          <div className="flex flex-col sm:flex-row justify-between mb-12">
            <div>
              <h2 className="text-xl font-semibold text-[#27391C]">
                订单编号：#{checkout._id}
              </h2>
              <p className="text-gray-500 mt-1">
                下单日期：{new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <p className="text-[#1F7D53] font-medium">
                预计送达：{calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* 商品清单 */}
          <div className="mb-12">
            {checkout.checkoutItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between mb-4 bg-[#F8FAF8] rounded-lg p-4 hover:shadow"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-[#255F38]">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {item.color} / {item.size}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#27391C] font-medium">${item.price}</p>
                  <p className="text-sm text-gray-500">数量：{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 支付方式 & 收货地址 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-[#18230F] mb-2">
                支付信息
              </h4>
              <p className="text-gray-600">付款方式：PayPal</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#18230F] mb-2">
                配送地址
              </h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage; // 导出订单确认页组件
