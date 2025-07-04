// Profile.jsx
// 用户个人中心页：显示用户信息、订单记录、收藏商品和浏览历史

import { useDispatch, useSelector } from "react-redux";
import MyOrdersPage from "./MyOrdersPage"; // 我的订单组件
import MyFavorites from "./MyFavorites"; // 我的收藏组件
import MyBrowsingHistory from "./MyBrowsingHistory"; // 我的浏览历史组件
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../redux/slices/authSlice"; // 注销登录 Action
import { clearCart } from "../redux/slices/cartSlice"; // 清空购物车 Action

const Profile = () => {
  const { user } = useSelector((state) => state.auth); // 获取当前登录用户信息
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 如果未登录，强制跳转到登录页
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // 退出登录：清除用户状态和购物车，并跳转登录页
  const handleLogout = () => {
    dispatch(logout()); // 注销用户
    dispatch(clearCart()); // 清空购物车
    navigate("/login"); // 跳转至登录页
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <div className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
          {/* 左侧：用户信息卡片 */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-xl rounded-2xl p-6">
            <div className="flex flex-col items-center text-center">
              {/* 用户首字母头像 */}
              <div className="w-20 h-20 bg-[#D1FAE5] text-[#1F7D53] rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              {/* 用户姓名 */}
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                {user?.name}
              </h1>
              {/* 用户邮箱 */}
              <p className="text-sm text-gray-500 mb-6">{user?.email}</p>

              {/* 退出登录按钮 */}
              <button
                onClick={handleLogout}
                className="w-full bg-[#316e00] text-white py-2 px-4 rounded-lg hover:bg-[#316e00] transition font-medium"
              >
                退出登录
              </button>
            </div>
          </div>

          {/* 右侧：我的订单、我的收藏、我的浏览历史 */}
          <div className="w-full md:w-2/3 lg:w-3/4 space-y-8">
            {/* 我的订单模块 */}
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <h2 className="text-xl font-bold text-[#1F2937] mb-4">
                我的订单
              </h2>
              <MyOrdersPage /> {/* 嵌套订单组件 */}
            </div>

            {/* 我的收藏模块 */}
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <MyFavorites /> {/* 嵌套收藏组件 */}
            </div>

            {/* 我的浏览记录模块 */}
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <MyBrowsingHistory /> {/* 嵌套浏览记录组件 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; // 导出 Profile 页面组件
