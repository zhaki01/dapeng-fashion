// checkoutSlice.js
// 📌 本模块用于管理“结账”流程的状态（Redux）
// ✅ 使用 Redux Toolkit 提供的 createSlice + createAsyncThunk 简化异步操作与状态管理
// ✅ 使用 axiosInstance 发起网络请求（后端接口）
// ✅ 支持功能：创建结账会话（Checkout Session）
// ✅ 导出：checkoutReducer 用于 Redux Store 注册

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios"; // 如未配置axios实例，可取消注释使用
// import axiosInstance from "../../axiosConfig"; // axios 实例（已配置 baseURL 和拦截器）
import axiosInstance from "@/utils/axiosConfig"; // 已封装的 axios 实例

// 🧾 创建结账会话（异步函数）
// 提交用户选择的商品、收货信息、支付方式等，向后端发起结账请求
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout", // action 类型
  async (checkoutdata, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`, // 提交结账数据到后端
        checkoutdata, // 结账所需数据（商品、地址、支付方式等）
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`, // 添加用户认证令牌
          },
        }
      );
      return response.data; // 成功返回数据
    } catch (error) {
      return rejectWithValue(error.response.data); // 返回错误信息
    }
  }
);

// 🧠 Redux Slice：结账状态管理模块
const checkoutSlice = createSlice({
  name: "checkout", // 模块名称
  initialState: {
    checkout: null, // 当前结账数据
    loading: false, // 加载状态
    error: null, // 错误信息
  },
  reducers: {
    // 当前没有定义同步 reducers
  },
  extraReducers: (builder) => {
    builder
      // ======= 请求开始 =======
      .addCase(createCheckout.pending, (state) => {
        state.loading = true; // 显示加载状态
        state.error = null; // 清除旧的错误信息
      })
      // ======= 请求成功 =======
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false; // 停止加载
        state.checkout = action.payload; // 保存返回的结账数据
      })
      // ======= 请求失败 =======
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false; // 停止加载
        state.error = action.payload.message; // 保存错误信息
      });
  },
});

// ✅ 导出 reducer，用于在 Redux Store 中注册
export default checkoutSlice.reducer;
