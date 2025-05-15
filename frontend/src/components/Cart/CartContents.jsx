// CartContents.jsx
// 🛒 购物车内容组件
// 说明：本组件用于展示购物车中的所有商品条目，并支持数量加减、删除等交互操作。
// 依赖 Redux 状态管理，使用了 react-icons 图标和 React Router 页面结构。

import { RiDeleteBin3Line } from "react-icons/ri"; // 🗑️ 引入删除图标
import { useDispatch } from "react-redux"; // Redux 的派发钩子
import {
  removeFromCart, // ✅ 从购物车移除商品
  updateCartItemQuantity, // ✅ 修改商品数量
} from "../../redux/slices/cartSlice";

// 接收 props：cart（购物车对象）、userId（登录用户ID）、guestId（访客ID）
const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch(); // 初始化 Redux 的 dispatch

  // ✅ 处理购物车数量加减操作
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta; // 计算新数量
    if (newQuantity >= 1) {
      // 派发更新商品数量的 action
      dispatch(
        updateCartItemQuantity({
          productId, // 商品 ID
          quantity: newQuantity, // 新数量
          guestId, // 访客身份
          userId, // 用户身份
          size, // 商品尺寸
          color, // 商品颜色
        })
      );
    }
  };

  // ✅ 删除购物车商品
  const handleRemoveFromCart = (productId, size, color) => {
    // 派发删除动作，传入商品 ID 和规格信息
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  // ✅ 组件主结构：渲染购物车商品列表
  return (
    <div>
      {/* 遍历购物车中的商品数组 */}
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          {/* 左侧：商品图片 + 信息 */}
          <div className="flex items-start">
            <img
              src={product.image} // 商品图
              alt={product.name}
              className="w-16 h-20 sm:w-20 sm:h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3>{product.name}</h3> {/* 商品名 */}
              <p className="text-sm text-gray-500">
                size: {product.size} | color: {product.color} {/* 规格信息 */}
              </p>
              {/* ✅ 数量加减按钮 */}
              <div className="flex items-center mt-2">
                {/* 减数量按钮 */}
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1, // -1 表示减少数量
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  -
                </button>

                {/* 当前数量 */}
                <span className="mx-4">{product.quantity}</span>

                {/* 加数量按钮 */}
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      1, // +1 表示增加数量
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：商品价格 + 删除按钮 */}
          <div>
            <p className="font-medium">
              $ {product.price.toLocaleString()} {/* 格式化价格 */}
            </p>
            {/* 删除按钮 */}
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )
              }
            >
              <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ✅ 导出组件
export default CartContents;
