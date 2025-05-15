// MyFavorites.jsx
// 我的收藏页面：展示用户收藏的商品，支持取消收藏操作

import React, { useEffect, useState } from "react";
// import axios from "axios";
import axiosInstance from "../utils/axiosConfig"; // 使用配置好的 axios 实例（自动包含 baseURL、headers 等）
import FavoriteCard from "../components/Products/FavoriteCard"; // 收藏商品卡片展示组件

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]); // 存储收藏数据列表
  const [loading, setLoading] = useState(false); // 加载状态
  const [error, setError] = useState(null); // 错误信息

  // 异步请求：获取收藏商品列表
  const fetchFavorites = async () => {
    setLoading(true); // 开始加载
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorites`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`, // 使用本地 token 认证
          },
        }
      );
      setFavorites(response.data); // 保存返回的收藏数据
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "获取收藏失败");
    }
    setLoading(false); // 加载结束
  };

  // 页面加载后立即请求收藏数据
  useEffect(() => {
    fetchFavorites();
  }, []);

  // 处理取消收藏：发送 DELETE 请求并刷新收藏列表
  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await axiosInstance.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorites/${favoriteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      fetchFavorites(); // 删除成功后重新拉取收藏数据
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "取消收藏失败");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1F2937] mb-4">我的收藏</h2>

      {/* 加载中状态 */}
      {loading ? (
        <p>加载中...</p>
      ) : // 错误状态
      error ? (
        <p className="text-red-500">错误：{error}</p>
      ) : // 有收藏数据时展示收藏卡片列表
      favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((fav) => (
            <FavoriteCard
              key={fav._id}
              favorite={fav} // 收藏项（包含 product 信息）
              onRemove={handleRemoveFavorite} // 删除操作传入卡片组件
            />
          ))}
        </div>
      ) : (
        // 没有收藏数据时提示
        <p>暂无收藏记录</p>
      )}
    </div>
  );
};

export default MyFavorites; // 导出我的收藏页面组件
