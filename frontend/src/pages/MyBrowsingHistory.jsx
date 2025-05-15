// src/pages/MyBrowsingHistory.jsx
// 我的浏览历史页面：展示用户近期浏览过的商品

import React, { useEffect, useState } from "react";
// import axios from "axios";
import axiosInstance from "../utils/axiosConfig"; // 使用已封装的 axios 实例（带 baseURL 和 headers 配置）
import ProductGrid from "../components/Products/ProductGrid"; // 商品列表网格展示组件

const MyBrowsingHistory = () => {
  const [historyRecords, setHistoryRecords] = useState([]); // 存储从后端获取的浏览记录
  const [loading, setLoading] = useState(false); // 加载状态
  const [error, setError] = useState(null); // 错误信息

  // 异步请求：获取用户的浏览历史
  const fetchBrowsingHistory = async () => {
    setLoading(true); // 开始加载
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/history`, // 后端浏览记录 API
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`, // 从本地存储获取用户 token
          },
        }
      );
      setHistoryRecords(response.data); // 保存返回的数据
    } catch (err) {
      console.error(err);
      // 设置错误信息（优先使用后端返回的 message）
      setError(err.response?.data?.message || "获取浏览记录失败");
    }
    setLoading(false); // 结束加载
  };

  // 页面加载时自动执行获取数据
  useEffect(() => {
    fetchBrowsingHistory();
  }, []);

  // 从每条浏览记录中提取 productId 字段（已通过 populate 拿到完整商品信息）
  // 使用 Map 通过 _id 对商品去重，避免重复展示同一个商品
  const products = Array.from(
    new Map(
      historyRecords
        .map((record) => record.productId) // 提取商品对象
        .filter((product) => product) // 过滤掉无效记录
        .map((p) => [p._id, p]) // 使用 _id 作为唯一键进行去重
    ).values()
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1F2937] mb-4">浏览历史</h2>

      {/* 加载中状态 */}
      {loading ? (
        <p>加载中...</p>
      ) : // 错误状态
      error ? (
        <p className="text-red-500">错误：{error}</p>
      ) : // 成功加载并有商品
      products.length > 0 ? (
        <ProductGrid products={products} /> // 使用商品网格组件展示浏览商品
      ) : (
        // 成功加载但无浏览记录
        <p>暂无浏览记录</p>
      )}
    </div>
  );
};

export default MyBrowsingHistory; // 导出组件供路由页面调用
