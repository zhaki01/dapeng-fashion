// checkoutSlice.js
//  该文件定义了一个 Redux slice，用于管理结账的状态和异步操作
//  该文件使用 Redux Toolkit 的 createSlice 和 createAsyncThunk 来简化 Redux 的使用
// 该文件还使用了 axios 来进行 HTTP 请求
// 该文件导出了一个 reducer，用于在 Redux store 中管理结账的状态
// 该文件还导出了一个异步操作，用于创建结账会话
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import axiosInstance from "../../axiosConfig"; // 确保 axios 实例已配置好
import axiosInstance from "@/utils/axiosConfig";

// Async thunk to create a checkout session
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutdata, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        checkoutdata,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default checkoutSlice.reducer;
