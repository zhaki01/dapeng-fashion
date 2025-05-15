// adminOrderSlice.js
// ✅ 管理员订单状态模块（Redux Slice）
// 用于管理订单列表、订单状态更新、订单删除等异步操作状态
// 技术栈：Redux Toolkit（createSlice + createAsyncThunk）+ axiosInstance（带 Token 请求）

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosConfig"; // 自定义 Axios 实例（自动注入 BaseURL）

// ✅ 异步操作1：获取所有订单（管理员权限）
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`, // 携带用户令牌
          },
        }
      );
      return response.data; // 返回订单数据数组
    } catch (error) {
      return rejectWithValue(error.response.data); // 返回错误信息
    }
  }
);

// ✅ 异步操作2：更新订单状态（如：配送状态）
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        { status }, // 提交新的订单状态
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data; // 返回更新后的订单
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ 异步操作3：删除订单
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return id; // 删除成功后返回订单ID
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ 创建 Slice：adminOrders
const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [], // 所有订单数据
    totalOrders: 0, // 订单总数
    totalSales: 0, // 销售总额（通过订单价格累加计算）
    loading: false, // 是否正在加载
    error: null, // 错误信息（如果有）
  },
  reducers: {}, // 本 Slice 无同步 reducers
  extraReducers: (builder) => {
    builder
      // 🔄 处理 fetchAllOrders 状态变化
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;

        // 计算订单总销售额
        const totalSales = action.payload.reduce((acc, order) => {
          return acc + order.totalPrice;
        }, 0);
        state.totalSales = totalSales;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message; // 记录错误信息
      })

      // ✅ 处理 updateOrderStatus 成功更新的订单
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder; // 替换为更新后的订单
        }
      })

      // ✅ 处理 deleteOrder 成功删除的订单
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload // 排除被删除的订单
        );
      });
  },
});

// ✅ 导出该 Slice 的 reducer，供 store 使用
export default adminOrderSlice.reducer;
