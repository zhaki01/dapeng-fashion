// Register.jsx
// 用户注册页：用于创建新账户、验证输入、自动登录并跳转

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../assets/register2.png"; // 页面右侧展示图
import { registerUser } from "../redux/slices/authSlice"; // 注册用户的 Redux Action
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice"; // 合并访客购物车

const Register = () => {
  // 用户输入信息的状态管理
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 确认密码

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // 从 Redux 中获取用户、购物车和认证状态
  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // 获取 URL 参数中的重定向地址，默认为首页
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  // 如果注册成功（user 不为空），跳转目标页，并合并访客购物车
  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  // 表单提交处理
  const handleSubmit = (e) => {
    e.preventDefault();

    // 检查密码与确认密码是否一致
    if (password !== confirmPassword) {
      alert("两次输入的密码不一致，请重新输入！");
      return;
    }

    // 调用 Redux 注册 Action
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* 左侧注册表单区域 */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 bg-[#F9FAF9]">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-10 rounded-2xl border border-gray-200 shadow-sm"
        >
          {/* 顶部 Logo/标题 */}
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-bold text-[#1F7D53] tracking-wider">
              鹏衣有道
            </h2>
          </div>

          <h2 className="text-2xl font-bold text-center mb-4 text-[#27391C]">
            创建新账户 📝
          </h2>
          <p className="text-center mb-6 text-sm text-gray-600">
            请填写以下信息以注册新账户
          </p>

          {/* 输入框：姓名 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              姓名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F7D53]"
              placeholder="请输入您的姓名"
            />
          </div>

          {/* 输入框：邮箱 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F7D53]"
              placeholder="请输入邮箱地址"
            />
          </div>

          {/* 输入框：密码 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F7D53]"
              placeholder="请输入密码"
            />
          </div>

          {/* 输入框：确认密码 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              确认密码
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F7D53]"
              placeholder="请再次输入密码"
            />
          </div>

          {/* 错误提示 */}
          {error && (
            <p className="text-red-600 text-sm text-center mb-4">{error}</p>
          )}

          {/* 注册按钮 */}
          <button
            type="submit"
            className="w-full bg-[#1F7D53] text-white py-3 rounded-md font-semibold hover:bg-[#255F38] transition"
          >
            {loading ? "注册中..." : "立即注册"}
          </button>

          {/* 底部跳转登录链接 */}
          <p className="mt-6 text-center text-sm text-gray-600">
            已有账户？
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-[#1F7D53] ml-1 hover:underline"
            >
              前往登录
            </Link>
          </p>
        </form>
      </div>

      {/* 右侧插图展示区域（仅大屏显示） */}
      <div className="hidden md:block w-1/2 relative">
        <div className="absolute inset-0 bg-black/20 z-10 rounded-l-2xl"></div>
        <img
          src={register}
          alt="注册页面图"
          className="h-full w-full object-cover rounded-l-2xl"
        />
      </div>
    </div>
  );
};

export default Register; // 导出注册页面组件
