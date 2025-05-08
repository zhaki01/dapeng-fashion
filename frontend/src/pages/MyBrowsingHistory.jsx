// src/pages/MyBrowsingHistory.jsx
import React, { useEffect, useState } from "react";
// import axios from "axios";
import axiosInstance from "../utils/axiosConfig"; // 确保 axios 实例已配置好
import ProductGrid from "../components/Products/ProductGrid";

const MyBrowsingHistory = () => {
  const [historyRecords, setHistoryRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBrowsingHistory = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      setHistoryRecords(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "获取浏览记录失败");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBrowsingHistory();
  }, []);

  // 从每条记录中提取 product 数据（假设后端已 populate）
  // const products = historyRecords
  //   .map((record) => record.productId)
  //   .filter((product) => product); // 过滤掉没有填充数据的记录

  const products = Array.from(
    new Map(
      historyRecords
        .map((record) => record.productId)
        .filter((product) => product)
        .map((p) => [p._id, p]) // 用 _id 去重
    ).values()
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1F2937] mb-4">浏览历史</h2>
      {loading ? (
        <p>加载中...</p>
      ) : error ? (
        <p className="text-red-500">错误：{error}</p>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p>暂无浏览记录</p>
      )}
    </div>
  );
};

export default MyBrowsingHistory;
