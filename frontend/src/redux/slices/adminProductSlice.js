// adminProductSlice.js
// 加注释中文
// 该文件定义了一个 Redux slice，用于管理管理员产品的状态和异步操作
// 该文件使用 Redux Toolkit 的 createSlice 和 createAsyncThunk 来简化 Redux 的使用
// 该文件还使用了 axios 来进行 HTTP 请求
// 该文件导出了一个 reducer，用于在 Redux store 中管理产品的状态
// 该文件还导出了几个异步操作，用于获取所有产品、创建新产品、更新产品和删除产品

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import axiosInstance from "../../axiosConfig"; // 确保 axios 实例已配置好
import axiosInstance from "@/utils/axiosConfig";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async () => {
    const response = await axiosInstance.get(`${API_URL}/api/admin/products`, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return response.data;
  }
);

// async function to create a new product
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
    return response.data;
  }
);

// async thunk to update an existing product
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }) => {
    const response = await axiosInstance.put(
      `${API_URL}/api/admin/products/${id}`,
      productData,
      {
        headers: {
          Authorization: USER_TOKEN,
        },
      }
    );
    return response.data;
  }
);

// async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id) => {
    await axiosInstance.delete(`${API_URL}/api/products/${id}`, {
      headers: { Authorization: USER_TOKEN },
    });
    return id;
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //   Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      //   Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      //   Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      });
  },
});

export default adminProductSlice.reducer;
