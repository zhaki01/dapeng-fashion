// export default MyFavorites;
// MyFavorites.jsx
import React, { useEffect, useState } from "react";
// import axios from "axios";
import axiosInstance from "../utils/axiosConfig"; // 确保 axios 实例已配置好
import FavoriteCard from "../components/Products/FavoriteCard";

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorites`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      // 保存完整收藏记录，包含 _id 和 product 信息
      setFavorites(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "获取收藏失败");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // 删除收藏记录，调用 DELETE 接口后刷新收藏列表
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
      fetchFavorites();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "取消收藏失败");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1F2937] mb-4">我的收藏</h2>
      {loading ? (
        <p>加载中...</p>
      ) : error ? (
        <p className="text-red-500">错误：{error}</p>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((fav) => (
            <FavoriteCard
              key={fav._id}
              favorite={fav}
              onRemove={handleRemoveFavorite}
            />
          ))}
        </div>
      ) : (
        <p>暂无收藏记录</p>
      )}
    </div>
  );
};

export default MyFavorites;
