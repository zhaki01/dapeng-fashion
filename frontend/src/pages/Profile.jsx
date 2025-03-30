// Profile.jsx
// export default Profile;
import { useDispatch, useSelector } from "react-redux";
import MyOrdersPage from "./MyOrdersPage";
import MyFavorites from "./MyFavorites"; // 收藏组件
import MyBrowsingHistory from "./MyBrowsingHistory"; // 浏览记录组件
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <div className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
          {/* 左侧用户信息 */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-xl rounded-2xl p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#D1FAE5] text-[#1F7D53] rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                {user?.name}
              </h1>
              <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="w-full bg-[#316e00] text-white py-2 px-4 rounded-lg hover:bg-[#316e00] transition font-medium"
              >
                退出登录
              </button>
            </div>
          </div>

          {/* 右侧：订单、收藏和浏览记录 */}
          <div className="w-full md:w-2/3 lg:w-3/4 space-y-8">
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <h2 className="text-xl font-bold text-[#1F2937] mb-4">
                我的订单
              </h2>
              <MyOrdersPage />
            </div>
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <MyFavorites />
            </div>
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <MyBrowsingHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
