// adminSlice.js
// 管理员用户状态模块（Redux Slice）
// 功能：获取、添加、更新、删除用户
// 技术栈：Redux Toolkit（createSlice + createAsyncThunk）+ axios

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ 异步操作1：获取所有用户（仅管理员）
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }, // 携带身份令牌
    }
  );
  return response.data; // 返回用户列表数据
});

// ✅ 异步操作2：添加新用户
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data; // 返回新增用户数据
    } catch (error) {
      return rejectWithValue(error.response.data); // 捕获错误并返回
    }
  }
);

// ✅ 异步操作3：更新指定用户信息
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
      { name, email, role }, // 提交要更新的字段
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data.user; // 返回更新后的用户信息
  }
);

// ✅ 异步操作4：删除用户
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
  await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
  return id; // 返回被删除的用户 ID
});

// ✅ 创建 adminSlice，用于管理 users 状态
const adminSlice = createSlice({
  name: "管理员", // Slice 名称（可以改为 admin）
  initialState: {
    users: [], // 所有用户数据
    loading: false, // 加载状态
    error: null, // 错误信息
  },
  reducers: {}, // 无同步操作，仅异步处理

  // extraReducers 用于处理异步操作的状态变化
  extraReducers: (builder) => {
    builder
      // 获取用户：请求中
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      // 获取用户：成功
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // 存储获取到的用户数据
      })
      // 获取用户：失败
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 更新用户成功：更新对应用户信息
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user._id === updatedUser._id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser; // 替换旧用户数据
        }
      })

      // 删除用户成功：过滤掉被删除的用户
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })

      // 添加用户：请求中
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 添加用户：成功
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.user); // 将新用户加入列表
      })
      // 添加用户：失败
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message; // 记录错误信息
      });
  },
});

// ✅ 导出 reducer，供 Redux Store 使用
export default adminSlice.reducer;
