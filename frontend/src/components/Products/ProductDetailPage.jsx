// File: src/pages/ProductDetailPage.jsx
// ✅ 商品详情页组件（用于展示单个商品的详细信息）
// 功能：根据 URL 中的商品 ID 拉取对应数据，并记录登录用户的浏览历史
// 包含内容：商品详情显示 + 浏览记录保存（仅限登录用户）

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks，用于派发 action、获取状态
import { useParams } from "react-router-dom"; // 从 URL 获取参数，如产品 id
import axiosInstance from "@/utils/axiosConfig"; // 已封装的 axios 请求实例（带 token）
import { fetchProductDetails } from "../../redux/slices/productsSlice"; // 拉取商品详情的 Redux action
import ProductDetails from "../components/Products/ProductDetails"; // 展示商品信息的组件

const ProductDetailPage = () => {
  const dispatch = useDispatch();

  const { id } = useParams(); // 获取 URL 中的产品 ID，如 /product/123

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products // 从 Redux 中获取商品详情状态
  );

  const { user } = useSelector((state) => state.auth); // 获取当前登录用户信息

  // 🔁 当页面加载或商品 ID 变化时，自动从后端获取该商品的详细数据
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  // 📝 记录用户浏览历史（仅在用户已登录时触发）
  useEffect(() => {
    if (!user || !id) return; // 如果用户未登录或没有商品 ID，则不执行

    // 调用后端接口保存浏览记录
    const recordViewHistory = async () => {
      try {
        console.log("正在记录浏览历史...", { userId: user._id, productId: id });

        const response = await axiosInstance.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/history/view`, // 请求地址
          { productId: id }, // 请求体：只需传递 productId
          {
            headers: {
              Authorization: `Bearer ${user.token}`, // 携带用户身份 Token
              "Content-Type": "application/json", // 设置请求格式
            },
          }
        );

        console.log("浏览记录保存成功:", response.data);
      } catch (error) {
        console.error("浏览记录保存失败:", {
          status: error.response?.status, // 错误状态码（如 401）
          data: error.response?.data, // 错误返回内容
          message: error.message, // 错误消息
        });
      }
    };

    recordViewHistory(); // 执行记录函数
  }, [user, id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 三种加载状态：加载中、加载出错、加载成功 */}
      {loading ? (
        <p>加载中...</p> // 加载中提示
      ) : error ? (
        <p className="text-red-500">出错啦：{error}</p> // 报错时显示
      ) : selectedProduct ? (
        <ProductDetails productId={id} /> // 加载成功：传入商品 ID 渲染详情组件
      ) : (
        <p>未找到该商品。</p> // 如果 selectedProduct 为空，说明商品不存在
      )}
    </div>
  );
};

export default ProductDetailPage;
