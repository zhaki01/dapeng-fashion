// Checkout page component
//
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
// import axios from "axiosInstance";
// import axiosInstance from "../../axiosConfig"; // 确保 axios 实例已配置好
import axiosInstance from "@/utils/axiosConfig";
const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "Paypal",
          totalPrice: cart.totalPrice,
        })
      );
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
      }
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      await axiosInstance.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "已支付", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      await handleFinalizeCheckout(checkoutId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      await axiosInstance.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      navigate("/order-confirmation");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>加载购物车中...</p>;
  if (error) return <p>发生错误：{error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>您的购物车是空的。</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tight">
      {/* 左侧：填写信息 */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-[#1F7D53] mb-6">结账信息</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg font-semibold mb-4">联系方式</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">电子邮箱</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-3 border rounded-lg bg-gray-100"
              disabled
            />
          </div>
          <h3 className="text-lg font-semibold mb-4">配送信息</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">名</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">姓</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">详细地址</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">城市</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">邮政编码</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">国家/地区</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">联系电话</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          {!checkoutId ? (
            <button
              type="submit"
              className="w-full bg-[#27391C] text-white py-3 rounded-lg font-semibold hover:bg-[#1F7D53] transition"
            >
              继续支付
            </button>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">使用 PayPal 支付</h3>
              <PayPalButton
                amount={cart.totalPrice}
                onSuccess={handlePaymentSuccess}
                onError={() => alert("支付失败，请重试。")}
              />
            </div>
          )}
        </form>
      </div>

      {/* 右侧：订单摘要 */}
      <div className="bg-[#f9fafb] p-6 rounded-2xl shadow-sm">
        <h3 className="text-xl font-semibold mb-4">订单摘要</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-4 border-b"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover rounded-xl mr-4"
                />
                <div>
                  <h3 className="text-md font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm">尺码：{product.size}</p>
                  <p className="text-gray-500 text-sm">颜色：{product.color}</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-800">
                ${product.price?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-base mb-2">
          <p>商品小计</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-base">
          <p>配送费</p>
          <p>免费</p>
        </div>
        <div className="flex justify-between items-center text-lg font-bold border-t pt-4 mt-4">
          <p>订单总额</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
