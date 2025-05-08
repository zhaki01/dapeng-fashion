// Desc: Order Confirmation Page
// OrderConfirmationPage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-[#1F7D53] mb-10">
        感谢您的订单！
      </h1>

      {checkout && (
        <div className="p-6 rounded-2xl border shadow-sm bg-white">
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
export default OrderConfirmationPage;
