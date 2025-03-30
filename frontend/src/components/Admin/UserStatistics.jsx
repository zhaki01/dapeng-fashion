// UserStatistics.jsx
// 用户统计组件
// 该组件用于显示用户的统计信息，包括浏览记录、订单数量、总消费金额和收藏数量
// 该组件使用了 useEffect 来获取用户数据，并在组件加载时进行数据请求
// 该组件使用了 useState 来管理状态
import React, { useEffect, useState } from "react";
// import axios from "axiosInstance";
// import axiosInstance from "../../axiosConfig"; // 确保 axios 实例已配置好
import axiosInstance from "@/utils/axiosConfig";
const UserStatistics = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserStats, setSelectedUserStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState(null);

  // 获取所有用户（管理员接口）
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        setUsers(response.data);
      } catch (err) {
        setError("获取用户失败");
      }
    };
    fetchUsers();
  }, []);

  // 获取选中用户的统计数据
  const fetchUserStats = async (userId) => {
    setLoadingStats(true);
    try {
      // 获取用户浏览记录（此接口需支持根据 userId 查询）
      const browsingResponse = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/history?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      const browsingCount = Array.isArray(browsingResponse.data)
        ? browsingResponse.data.length
        : 0;

      // 获取用户订单（此接口需支持管理员查询指定用户的订单）
      const ordersResponse = await axiosInstance.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/orders/my-orders?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      const orders = Array.isArray(ordersResponse.data)
        ? ordersResponse.data
        : [];
      const orderCount = orders.length;
      const totalSpent = orders.reduce(
        (acc, order) => acc + order.totalPrice,
        0
      );

      // 获取用户收藏记录
      const favoritesResponse = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorites?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      const favoritesCount = Array.isArray(favoritesResponse.data)
        ? favoritesResponse.data.length
        : 0;

      setSelectedUserStats({
        browsingCount,
        orderCount,
        totalSpent,
        favoritesCount,
      });
    } catch (err) {
      console.error(err);
      setError("获取统计数据失败");
    }
    setLoadingStats(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#1F7D53] mb-6">用户统计</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左侧用户列表 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">用户列表</h3>
          <ul className="divide-y">
            {users.map((user) => (
              <li
                key={user._id}
                className="py-2 flex justify-between items-center"
              >
                <span>
                  {user.name} ({user.email})
                </span>
                <button
                  onClick={() => fetchUserStats(user._id)}
                  className="bg-[#1F7D53] text-white px-3 py-1 rounded hover:bg-[#255F38] transition"
                >
                  查看统计
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* 右侧统计详情 */}
        <div>
          {loadingStats ? (
            <p>加载统计数据中...</p>
          ) : selectedUserStats ? (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">统计详情</h3>
              <p className="mb-2">
                浏览记录数量：{selectedUserStats.browsingCount}
              </p>
              <p className="mb-2">订单数量：{selectedUserStats.orderCount}</p>
              <p className="mb-2">
                总消费金额：￥{selectedUserStats.totalSpent.toFixed(2)}
              </p>
              <p className="mb-2">
                收藏数量：{selectedUserStats.favoritesCount}
              </p>
            </div>
          ) : (
            <p>请选择一个用户查看统计数据</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
