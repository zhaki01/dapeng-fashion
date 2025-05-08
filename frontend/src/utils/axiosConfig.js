// axiosConfig.js
// This file configures the Axios instance for making HTTP requests.
import axios from "axios";
import { toast } from "sonner";
import { logout } from "@/redux/slices/authSlice";

let store;
import("@/redux/store").then((module) => {
  store = module.default;
});

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("登录状态已过期，请重新登录");
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      store?.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
