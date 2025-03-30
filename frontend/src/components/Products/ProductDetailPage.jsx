// src/pages/ProductDetailPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import axiosInstance from "../../axiosConfig"; // 确保 axios 实例已配置好
import axiosInstance from "@/utils/axiosConfig";
import { fetchProductDetails } from "../../redux/slices/productsSlice";
import ProductDetails from "../components/Products/ProductDetails";

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // 从 URL 中获取产品 id
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);

  // 每次 id 变化时重新获取产品详情
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  // 记录浏览历史：只有当用户已登录且产品 id 存在时触发
  useEffect(() => {
    if (!user || !id) return;
    const recordViewHistory = async () => {
      try {
        console.log("正在记录浏览历史...", { userId: user._id, productId: id });
        const response = await axiosInstance.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/history/view`,
          { productId: id },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("浏览记录保存成功:", response.data);
      } catch (error) {
        console.error("浏览记录保存失败:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }
    };
    recordViewHistory();
  }, [user, id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {loading ? (
        <p>加载中...</p>
      ) : error ? (
        <p className="text-red-500">出错啦：{error}</p>
      ) : selectedProduct ? (
        <ProductDetails productId={id} />
      ) : (
        <p>未找到该商品。</p>
      )}
    </div>
  );
};

export default ProductDetailPage;
