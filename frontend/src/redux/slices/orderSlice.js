// orderSlice.js

// orderSlice.js
// 📌 本模块用于管理用户订单的 Redux 状态和异步操作
// ✅ 使用 Redux Toolkit 的 createSlice 与 createAsyncThunk 简化状态管理
// ✅ 包含功能：获取当前用户订单列表、获取单个订单详情
// ✅ 使用封装好的 axios 实例 axiosInstance 发起请求

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import axiosInstance from "../../axiosConfig"; // 也可使用其他 axios 实例
import axiosInstance from "@/utils/axiosConfig"; // 封装好的 axios 实例，自动附带 baseURL 和拦截器

// ✅ 异步操作：获取当前用户的所有订单列表
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders", // action 名称
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`, // 向后端请求用户订单
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`, // 加入用户令牌
          },
        }
      );
      return response.data; // 返回订单数据
    } catch (error) {
      return rejectWithValue(error.response.data); // 出错时返回错误信息
    }
  }
);

// ✅ 异步操作：根据订单 ID 获取单个订单的详细信息
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`, // 根据订单 ID 查询
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`, // 添加认证信息
          },
        }
      );
      return response.data; // 返回订单详情数据
    } catch (error) {
      rejectWithValue(error.response.data); // 捕获错误并返回
    }
  }
);

// ✅ 创建订单状态切片（Slice）
const orderSlice = createSlice({
  name: "orders", // 模块名称
  initialState: {
    orders: [], // 当前用户的所有订单
    totalOrders: 0, // 总订单数量（可扩展使用）
    orderDetails: null, // 单个订单详情
    loading: false, // 加载状态
    error: null, // 错误信息
  },
  reducers: {
    // 当前未定义同步 reducers
  },
  extraReducers: (builder) => {
    builder
      // ========== 获取订单列表 ==========
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null; // 清除错误
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; // 保存订单列表
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message; // 显示错误信息
      })

      // ========== 获取订单详情 ==========
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload; // 保存订单详情
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message; // 显示错误信息
      });
  },
});

// ✅ 导出 reducer，供 Redux store 注册使用
export default orderSlice.reducer;
