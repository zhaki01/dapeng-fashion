// App.jsx is the root component of the application. It contains the routing configuration for the application using the react-router-dom library.
// App.jsx
// ✅ 本文件是应用程序的根组件（入口）
// ✅ 使用 react-router-dom 配置用户端与管理员端的前端路由
// ✅ 使用 Redux Provider 提供全局状态管理
// ✅ 使用 sonner 插件展示全局提示（toast 通知）
// ✅ 使用 ProtectedRoute 控制管理员路由的权限访问
// 引入前端路由组件
import { BrowserRouter, Route, Routes } from "react-router-dom";

// 用户端公共布局组件（包含 header/footer 等）
import UserLayout from "./components/Layout/UserLayout";

// 页面组件导入
import Home from "./pages/Home"; // 首页
import { Toaster } from "sonner"; // 全局提示组件
import Login from "./pages/Login"; // 登录页
import Register from "./pages/Register"; // 注册页
import Profile from "./pages/Profile"; // 用户个人中心页
import CollectionPage from "./pages/CollectionPage"; // 分类集合页
import ProductDetails from "./components/Products/ProductDetails"; // 商品详情页
import Checkout from "./components/Cart/Checkout"; // 结账页
import OrderConfirmationPage from "./pages/OrderConfirmationPage"; // 下单成功页
import OrderDetailsPage from "./pages/OrderDetailsPage"; // 订单详情页
import MyOrdersPage from "./pages/MyOrdersPage"; // 我的订单页

// 管理员相关组件
import AdminLayout from "./components/Admin/AdminLayout"; // 管理员布局
import AdminHomePage from "./pages/AdminHomePage"; // 管理员首页总览
import UserManagement from "./components/Admin/UserManagement"; // 用户管理页
import ProductManagement from "./components/Admin/ProductManagement"; // 商品管理页
import EditProductPage from "./components/Admin/EditProductPage"; // 商品编辑页
import OrderManagement from "./components/Admin/OrderManagement"; // 订单管理页
import UserStatistics from "./components/Admin/UserStatistics"; // 用户数据统计页
// import UserFavorites from "./pages/UserFavorites"; // 收藏页面（已注释未使用）

// 引入 Redux 相关
import { Provider } from "react-redux";
import store from "./redux/store";

// 路由权限保护组件（仅管理员可访问）
import ProtectedRoute from "./components/Common/ProtectedRoute";

// 创建新商品页面（仅管理员可访问）
import CreateProductPage from "./pages/CreateProductPage";

// App 根组件
const App = () => {
  return (
    // 使用 Provider 提供 Redux 全局状态
    <Provider store={store}>
      {/* BrowserRouter 包裹整个前端路由系统 */}
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }} // React Router v7 的预设配置
      >
        {/* 全局 toast 通知提示组件 */}
        <Toaster position="top-right" />

        {/* 路由配置开始 */}
        <Routes>
          {/* 用户端路由配置（嵌套在 UserLayout 中） */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} /> {/* 首页 */}
            <Route path="login" element={<Login />} /> {/* 登录 */}
            <Route path="register" element={<Register />} /> {/* 注册 */}
            <Route path="profile" element={<Profile />} />{" "}
            {/* 用户个人资料页 */}
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />{" "}
            {/* 分类集合页，动态路由 */}
            <Route path="product/:id" element={<ProductDetails />} />{" "}
            {/* 商品详情页 */}
            <Route path="checkout" element={<Checkout />} /> {/* 结账页 */}
            <Route
              path="order-confirmation"
              element={<OrderConfirmationPage />}
            />{" "}
            {/* 订单确认页 */}
            <Route path="order/:id" element={<OrderDetailsPage />} />{" "}
            {/* 单个订单详情页 */}
            <Route path="my-orders" element={<MyOrdersPage />} />{" "}
            {/* 我的全部订单列表 */}
          </Route>

          {/* 管理员端路由配置（嵌套在 AdminLayout 中） */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="管理员">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} /> {/* 管理员首页 */}
            <Route path="users" element={<UserManagement />} /> {/* 用户管理 */}
            <Route
              path="/admin/user-statistics"
              element={<UserStatistics />}
            />{" "}
            {/* 用户统计 */}
            <Route path="products" element={<ProductManagement />} />{" "}
            {/* 商品管理 */}
            <Route
              path="products/:id/edit"
              element={<EditProductPage />}
            />{" "}
            {/* 编辑商品 */}
            <Route path="orders" element={<OrderManagement />} />{" "}
            {/* 订单管理 */}
            <Route
              path="products/create"
              element={<CreateProductPage />}
            />{" "}
            {/* 添加新商品 */}
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

// 导出 App 根组件
export default App;
