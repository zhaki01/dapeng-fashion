// CartDrawer.jsx
// ✅ 购物车抽屉组件
// 本组件用于从页面右侧滑出的购物车界面，展示用户购物车中的商品信息，并提供“前往结算”按钮。
// 支持移动端和桌面端适配，购物车为空时显示提示语。

import { IoMdClose } from "react-icons/io"; // 引入关闭图标
import CartContents from "../Cart/CartContents"; // 引入购物车内容组件
import { useNavigate } from "react-router-dom"; // 用于页面跳转
import { useSelector } from "react-redux"; // 从 Redux 获取用户和购物车状态

// 接收两个 props：
// drawerOpen 控制抽屉是否打开
// toggleCartDrawer 用于切换抽屉显示状态
const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate(); // 路由跳转器
  const { user, guestId } = useSelector((state) => state.auth); // 获取当前用户信息（或访客 ID）
  const { cart } = useSelector((state) => state.cart); // 获取购物车状态
  const userId = user ? user._id : null; // 获取用户 ID，如果未登录则为 null

  // 点击“前往结算”按钮后的逻辑
  const handleCheckout = () => {
    toggleCartDrawer(); // 关闭抽屉
    if (!user) {
      // 如果未登录，跳转到登录页，并设置登录后重定向到 checkout
      navigate("/login?redirect=checkout");
    } else {
      // 已登录则直接跳转到结算页
      navigate("/checkout");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-xl transform transition-transform duration-300 flex flex-col z-50 rounded-l-2xl ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* 关闭按钮区域 */}
      <div className="flex justify-end p-4 border-b border-gray-200">
        <button
          onClick={toggleCartDrawer}
          className="hover:bg-gray-100 p-2 rounded-lg"
        >
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* 购物车内容区域，可滚动 */}
      <div className="flex-grow px-6 pt-4 pb-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#1F7D53] mb-4 tracking-tight">
          我的购物车
        </h2>
        {cart && cart?.products?.length > 0 ? (
          // ✅ 如果购物车有商品，展示商品列表
          <CartContents cart={cart} userId={userId} guestId={guestId} />
        ) : (
          // 🚫 如果购物车为空，显示提示语
          <p className="text-gray-500">您的购物车为空。</p>
        )}
      </div>

      {/* 底部结算按钮区域，始终固定在底部 */}
      <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
        {cart && cart?.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#1F7D53] text-white py-3 rounded-lg font-semibold hover:bg-[#255F38] transition"
            >
              前往结算
            </button>
            <p className="text-xs tracking-tight text-gray-500 mt-2 text-center">
              运费、税费和优惠将在结算时计算
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ✅ 导出 CartDrawer 组件
export default CartDrawer;
