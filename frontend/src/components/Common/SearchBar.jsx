// SearchBar.jsx
// ✅ 搜索栏组件
// 本组件用于在网页顶部提供商品名称搜索功能，点击放大镜按钮展开搜索框，输入后跳转到搜索结果页。
// 支持输入关键词、Redux 状态同步、页面跳转等功能。

import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2"; // 引入放大镜和关闭图标
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsByFilters, // 异步获取筛选后的商品
  setFilters, // 设置全局搜索过滤条件
} from "../../redux/slices/productsSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState(""); // 当前搜索关键词
  const [isOpen, setIsOpen] = useState(false); // 控制搜索框是否展开

  const dispatch = useDispatch(); // Redux 分发器
  const navigate = useNavigate(); // 路由跳转器

  // 切换搜索栏显示/隐藏状态
  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  // 提交搜索请求
  const handleSearch = (e) => {
    e.preventDefault(); // 阻止表单默认刷新行为

    // 将关键词写入 Redux 状态中（全局筛选）
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));

    // 页面跳转到搜索结果页（带关键词参数）
    navigate(`/collections/all?search=${searchTerm}`);

    // 搜索后关闭搜索框
    setIsOpen(false);
  };

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
      } `}
    >
      {isOpen ? (
        // ✅ 展开状态：显示搜索输入框
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="服装名称搜索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
            />
            {/* 🔍 提交搜索按钮（放大镜） */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>

          {/* ❌ 关闭按钮 */}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </form>
      ) : (
        // ✅ 收起状态：仅显示放大镜图标
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

// ✅ 导出组件
export default SearchBar;
