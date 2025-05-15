// authSlice.js
// 用户认证模块（用于登录、注册、注销、访客 ID 管理）
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ 从本地存储中读取登录用户信息（如存在）
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// ✅ 初始化访客 ID（如本地已有则使用已有的，否则新建一个）
const initialGuestId =
  localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// ✅ 初始状态
const initialState = {
  user: userFromStorage, // 当前登录用户信息
  guestId: initialGuestId, // 访客 ID（未登录用户也可使用）
  loading: false, // 异步加载状态
  error: null, // 错误信息
};

// ✅ 异步操作：用户登录
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`, // 登录接口
        userData
      );
      // 登录成功后，存储用户信息和 token
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return response.data.user; // 返回用户信息
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "登录失败，请重试" }
      );
    }
  }
);

// ✅ 异步操作：用户注册
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`, // 注册接口
        userData
      );
      // 注册成功后，存储用户信息和 token
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "注册失败，请重试" }
      );
    }
  }
);

// ✅ 创建 Slice（包含状态、同步 actions、异步 reducers）
const authSlice = createSlice({
  name: "auth", // Slice 名称
  initialState,
  reducers: {
    // ✅ 注销用户（清除用户信息 + 重置为访客）
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId);
    },

    // ✅ 生成新的访客 ID（例如清空购物车时使用）
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
  },

  // ✅ 处理异步状态变化（登录 & 注册）
  extraReducers: (builder) => {
    builder
      // 登录开始
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 登录成功
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      // 登录失败
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "登录失败";
      })

      // 注册开始
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 注册成功
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      // 注册失败
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "注册失败";
      });
  },
});

// ✅ 导出同步 Action（logout：退出登录，generateNewGuestId：生成访客 ID）
export const { logout, generateNewGuestId } = authSlice.actions;

// ✅ 导出 reducer 供 store 使用
export default authSlice.reducer;
