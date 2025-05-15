// UserStatistics.jsx
// 📊 用户统计组件
// 说明：本组件用于管理员查看每位用户的关键统计数据，包括浏览记录、订单数量、消费总额和收藏数量。
// - 使用 useEffect 在组件加载时获取所有用户列表
// - 使用 useState 管理当前选择用户的统计状态
// - 通过点击按钮获取对应用户的详细统计数据（调用多个后端接口）
// - 所有请求通过 axiosInstance 发起，使用本地存储的 token 验证身份

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosConfig"; // 已配置好的 axios 实例（带 baseURL 和 headers）

const UserStatistics = () => {
  const [users, setUsers] = useState([]); // 所有用户列表
  const [selectedUserStats, setSelectedUserStats] = useState(null); // 当前选中用户的统计数据
  const [loadingStats, setLoadingStats] = useState(false); // 控制加载状态
  const [error, setError] = useState(null); // 错误提示状态

  // ✅ 页面加载时，请求所有用户（管理员权限）
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
        setUsers(response.data); // 成功后保存用户列表
      } catch (err) {
        setError("获取用户失败"); // 出错提示
      }
    };
    fetchUsers();
  }, []);

  // ✅ 获取指定用户的统计数据（点击按钮触发）
  const fetchUserStats = async (userId) => {
    setLoadingStats(true); // 显示加载中
    try {
      // 🟠 获取浏览记录数量
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

      // 🟠 获取订单信息及总金额
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

      // 🟠 获取收藏数量
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

      // ✅ 设置选中用户的完整统计信息
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

  // ✅ 页面结构渲染
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#1F7D53] mb-6">用户统计</h2>

      {/* 错误提示 */}
      {error && <p className="text-red-500">{error}</p>}

      {/* 页面左右分栏布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ 左侧：用户列表 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">用户列表</h3>
          <ul className="divide-y">
            {users.map((user) => (
              <li
                key={user._id}
                className="py-2 flex justify-between items-center"
              >
                <span>
                  {user.name} ({user.email}) {/* 显示用户名与邮箱 */}
                </span>
                {/* 查看统计按钮 */}
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

        {/* ✅ 右侧：选中用户的统计详情 */}
        <div>
          {loadingStats ? (
            <p>加载统计数据中...</p> // 加载中提示
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
            <p>请选择一个用户查看统计数据</p> // 默认提示
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ 导出组件
export default UserStatistics;
