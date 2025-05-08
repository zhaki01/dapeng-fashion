// store.js
// // 该文件定义了 Redux store 的配置
// // 该文件使用 Redux Toolkit 的 configureStore 来创建 Redux store
// // 该文件导入了多个 slice，用于管理不同的状态
// // 该文件导出了创建的 Redux store
// // 该文件还使用了 axios 来进行 HTTP 请求
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/adminSlice";
import adminProductReducer from "./slices/adminProductSlice";
import adminOrdersReducer from "./slices/adminOrderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
    admin: adminReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrdersReducer,
  },
});

export default store;
