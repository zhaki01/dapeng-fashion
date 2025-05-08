// adminSlice.js
// 加注释
// 该文件定义了一个 Redux slice，用于管理管理员用户的状态和异步操作
// 该文件使用 Redux Toolkit 的 createSlice 和 createAsyncThunk 来简化 Redux 的使用
// 该文件还使用了 axios 来进行 HTTP 请求
// 该文件导出了一个 reducer，用于在 Redux store 中管理用户的状态
// 该文件还导出了几个异步操作，用于获取所有用户、添加新用户、更新用户和删除用户
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// fetch all users (admin only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    }
  );
  return response.data;
});

// Add the create user action
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update user info
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
      { name, email, role },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data.user;
  }
);

// Delete a user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
  await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
  return id;
});

const adminSlice = createSlice({
  name: "管理员",
  // name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;

        const userIndex = state.users.findIndex(
          (user) => user._id === updatedUser._id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.user); // add a new user to the state
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default adminSlice.reducer;
