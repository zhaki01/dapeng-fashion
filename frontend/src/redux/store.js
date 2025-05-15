// store.js
// 📌 本文件用于创建和配置 Redux 全局状态管理中心（store）
// ✅ 使用 Redux Toolkit 提供的 configureStore 简化创建流程
// ✅ 整合了多个功能模块的 reducer（如用户认证、商品、购物车、订单等）
// ✅ 将这些 reducer 注入到 Redux 的全局 store 中进行统一管理
import { configureStore } from "@reduxjs/toolkit";

// 引入各个模块（slice）的 reducer
import authReducer from "./slices/authSlice"; // 用户认证相关
import productReducer from "./slices/productsSlice"; // 商品展示相关
import cartReducer from "./slices/cartSlice"; // 购物车相关
import checkoutReducer from "./slices/checkoutSlice"; // 结账流程相关
import orderReducer from "./slices/orderSlice"; // 用户订单相关
import adminReducer from "./slices/adminSlice"; // 管理员用户管理
import adminProductReducer from "./slices/adminProductSlice"; // 管理员商品管理
import adminOrdersReducer from "./slices/adminOrderSlice"; // 管理员订单管理

// 创建 Redux store，并配置所有 reducer
const store = configureStore({
  reducer: {
    auth: authReducer, // 用户登录/注册/登出
    products: productReducer, // 商品筛选/获取
    cart: cartReducer, // 商品加入购物车、移除等操作
    checkout: checkoutReducer, // 结账数据管理
    orders: orderReducer, // 用户个人订单信息
    admin: adminReducer, // 管理员用户信息管理
    adminProducts: adminProductReducer, // 管理员商品管理
    adminOrders: adminOrdersReducer, // 管理员订单管理
  },
});

// 导出 store，供整个应用使用（通常在 index.js 中使用 <Provider store={store} />）
export default store;
