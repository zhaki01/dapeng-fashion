// src/redux/slices/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import axiosInstance from "../../axiosConfig"; // 确保 axios 实例已配置好
import axiosInstance from "@/utils/axiosConfig";

// 新增：根据用户偏好风格推荐商品
// export const fetchProductsByPreference = createAsyncThunk(
//   "products/fetchByPreference",
//   async (_, { getState }) => {
//     const { user } = getState().auth;
//     const res = await axiosInstance.get(`/api/history/preferences`, {
//       headers: {
//         Authorization: `Bearer ${user.token}`,
//       },
//     });
//     const { preferences } = res.data;
//     const filterRes = await axiosInstance.get(`/api/products`, {
//       params: { collection: preferences.join(",") },
//     });
//     return filterRes.data;
//   }
// );

// 新增：根据用户偏好风格推荐商品（修正版）
export const fetchProductsByPreference = createAsyncThunk(
  "products/fetchByPreference",
  async (_, { getState }) => {
    const { user } = getState().auth;
    if (!user) return [];
    const response = await axiosInstance.get(`/api/favorites/recommendations`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.data;
  }
);

// 新增：获取推荐商品
export const fetchRecommendations = createAsyncThunk(
  "products/fetchRecommendations",
  async (_, { getState, rejectWithValue }) => {
    const { user } = getState().auth;
    if (!user) return []; // 未登录返回空数组
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorites/recommendations`,
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

// 异步 Thunk：根据筛选条件获取产品
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
  }) => {
    const query = new URLSearchParams();
    if (collection) query.append("collection", collection);
    if (size) query.append("size", size);
    if (color) query.append("color", color);
    if (gender) query.append("gender", gender);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sortBy", sortBy);
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (material) query.append("material", material);
    if (brand) query.append("brand", brand);
    if (limit) query.append("limit", limit);

    const response = await axiosInstance.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
    );
    return response.data;
  }
);

// 异步 Thunk：获取单个产品详情
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    return response.data;
  }
);

// 异步 Thunk：更新产品（如有需要）
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const response = await axiosInstance.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

// 异步 Thunk：获取类似产品
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }) => {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data;
  }
);

const initialState = {
  products: [],
  recommendations: [], // 新增推荐产品数组
  selectedProduct: null,
  similarProducts: [],
  loading: false,
  error: null,
  filters: {
    category: "",
    size: "",
    color: "",
    gender: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    search: "",
    material: "",
    collection: "",
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // 处理 fetchProductsByFilters
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // 处理 fetchProductDetails
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // 处理 updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product._id === updatedProduct._id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // 处理 fetchSimilarProducts
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // 处理 fetchRecommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? action.payload.message
          : action.error.message;
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
