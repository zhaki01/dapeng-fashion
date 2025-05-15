// axiosConfig.js
// axiosConfig.js
// 📌 本文件用于配置 Axios 实例，统一管理所有 HTTP 请求的行为
// ✅ 自动附加身份令牌（token）到请求头中
// ✅ 全局处理 401 错误（身份过期）
// ✅ 使用 `sonner` 提示库进行错误弹窗
// ✅ 当 token 过期时自动登出并跳转到登录页面
// 引入 axios 库，用于发送 HTTP 请求
import axios from "axios";

// 引入 toast 消息提示（用于展示错误或通知信息）
import { toast } from "sonner";

// 引入登出操作，用于在 token 失效时登出用户
import { logout } from "@/redux/slices/authSlice";

// 定义一个变量用于存储 Redux 的 store（稍后动态引入）
let store;

// 动态引入 Redux store，避免循环依赖
import("@/redux/store").then((module) => {
  store = module.default;
});

// 创建一个自定义的 Axios 实例，设置基础配置
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // 后端接口地址（从环境变量中获取）
  headers: {
    "Content-Type": "application/json", // 默认请求类型为 JSON
  },
});

// 设置请求拦截器：请求发出前自动携带 token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken"); // 从本地获取 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 加入到请求头中
    }
    return config; // 返回配置
  },
  (error) => Promise.reject(error) // 请求出错时直接抛出错误
);

// 设置响应拦截器：统一处理响应错误
axiosInstance.interceptors.response.use(
  (response) => response, // 如果响应成功，直接返回结果
  (error) => {
    // 如果服务器返回 401（未授权），说明登录已过期
    if (error.response && error.response.status === 401) {
      toast.error("登录状态已过期，请重新登录"); // 弹出错误提示
      localStorage.removeItem("userToken"); // 清除本地存储的 token
      localStorage.removeItem("userInfo"); // 清除本地用户信息
      store?.dispatch(logout()); // 触发登出操作
      window.location.href = "/login"; // 重定向到登录页
    }

    return Promise.reject(error); // 抛出错误以供调用方处理
  }
);

// 导出配置好的 Axios 实例，供全局使用
export default axiosInstance;
