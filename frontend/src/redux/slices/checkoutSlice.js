// checkoutSlice.js
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
