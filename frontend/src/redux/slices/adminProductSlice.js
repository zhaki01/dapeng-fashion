// adminProductSlice.js
// 管理员产品管理模块（Redux Slice）
// 包含功能：获取商品列表、创建商品、更新商品、删除商品
// 技术栈：Redux Toolkit（createSlice + createAsyncThunk）+ axiosInstance

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosConfig"; // 自定义封装的 axios 实例

// ✅ 全局常量：API 请求地址 + 用户 Token
const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// ✅ 异步操作1：获取所有商品（管理员权限）
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async () => {
    const response = await axiosInstance.get(`${API_URL}/api/admin/products`, {
      headers: {
        Authorization: USER_TOKEN, // 带上认证令牌
      },
    });
    return response.data; // 返回产品数组
  }
);

// ✅ 异步操作2：创建新商品
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData) => {
    const response = await axiosInstance.post(
      `${API_URL}/api/admin/products`,
      productData,
      {
        headers: {
          Authorization: USER_TOKEN,
        },
      }
    );
    return response.data; // 返回创建成功的商品对象
  }
);

// ✅ 异步操作3：更新商品信息
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }) => {
    const response = await axiosInstance.put(
      `${API_URL}/api/admin/products/${id}`, // 根据 ID 发送 PUT 请求
      productData,
      {
        headers: {
          Authorization: USER_TOKEN,
        },
      }
    );
    return response.data; // 返回更新后的商品信息
  }
);

// ✅ 异步操作4：删除商品
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id) => {
    await axiosInstance.delete(`${API_URL}/api/products/${id}`, {
      headers: { Authorization: USER_TOKEN },
    });
    return id; // 删除成功后，返回被删除商品的 ID
  }
);

// ✅ 创建 Slice，用于管理 admin 产品状态
const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [], // 商品数组
    loading: false, // 是否加载中
    error: null, // 错误信息（如果有）
  },
  reducers: {}, // 无同步操作，全部使用 asyncThunk 管理

  // 异步操作状态处理
  extraReducers: (builder) => {
    builder
      // 📦 获取商品列表 - 请求中
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      // 📦 获取商品列表 - 请求成功
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // 存储产品数据
      })
      // 📦 获取商品列表 - 请求失败
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // 记录错误
      })

      // ➕ 创建商品成功后，添加进 products 列表
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      // ✏️ 更新商品成功后，替换 products 中对应商品
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload; // 用新数据替换原数据
        }
      })

      // ❌ 删除商品成功后，从 products 中移除该商品
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      });
  },
});

// ✅ 导出 reducer，供 store 使用
export default adminProductSlice.reducer;
