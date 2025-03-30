// Desc: Order details page
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <p>加载中...</p>;
  if (error) return <p className="text-red-500">出错啦：{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">订单详情</h2>
      {!orderDetails ? (
        <p>未找到订单信息</p>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border bg-white shadow-sm">
          {/* 订单信息 */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                订单编号：#{orderDetails._id}
              </h3>
              <p className="text-gray-600">
                下单时间：{new Date(orderDetails.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              <span
                className={`${
                  orderDetails.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isPaid ? "已支付" : "未支付"}
              </span>
              <span
                className={`${
                  orderDetails.isDelivered
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                } px-3 py-1 rounded-full text-sm font-medium`}
              >
                {orderDetails.isDelivered ? "已送达" : "配送中"}
              </span>
            </div>
          </div>

          {/* 支付与配送信息 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8 text-sm">
            <div>
              <h4 className="text-base font-semibold mb-2">支付信息</h4>
              <p>支付方式：{orderDetails.paymentMethod}</p>
              <p>状态：{orderDetails.isPaid ? "已支付" : "未支付"}</p>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-2">配送信息</h4>
              <p>配送方式：{orderDetails.shippingMethod}</p>
              <p>
                收货地址：{orderDetails.shippingAddress.city},{" "}
                {orderDetails.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* 商品清单 */}
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4">商品清单</h4>
            <table className="min-w-full text-gray-700 mb-4 text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="py-3 px-4">商品名称</th>
                  <th className="py-3 px-4">单价</th>
                  <th className="py-3 px-4">数量</th>
                  <th className="py-3 px-4">小计</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {item.name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 px-4">${item.price}</td>
                    <td className="py-4 px-4">{item.quantity}</td>
                    <td className="py-4 px-4">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link
            to="/my-orders"
            className="text-sm text-blue-500 hover:underline mt-4 inline-block"
          >
            返回我的订单
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
