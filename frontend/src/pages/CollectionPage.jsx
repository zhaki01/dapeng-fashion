// CollectionPage component
// CollectionPage.jsx
// 商品集合页组件：展示某个系列下的商品列表，支持筛选与排序

import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa"; // 导入筛选图标
import FilterSidebar from "../components/Products/FilterSidebar"; // 筛选组件（侧边栏）
import SortOptions from "../components/Products/SortOptions"; // 排序选项组件
import ProductGrid from "../components/Products/ProductGrid"; // 商品网格展示组件
import { useParams, useSearchParams } from "react-router-dom"; // 获取 URL 参数和搜索参数
import { useDispatch, useSelector } from "react-redux"; // Redux Hook
import { fetchProductsByFilters } from "../redux/slices/productsSlice"; // 根据筛选条件获取商品列表

const CollectionPage = () => {
  const { collection } = useParams(); // 从路由中获取当前商品系列名称
  const [searchParams] = useSearchParams(); // 获取查询字符串参数（如颜色、价格等）
  const dispatch = useDispatch(); // Redux 派发器
  const { products, loading, error } = useSelector((state) => state.products); // 从 Redux 中获取商品列表数据
  const queryParams = Object.fromEntries([...searchParams]); // 将 searchParams 转为对象格式

  const sidebarRef = useRef(null); // 创建 ref，用于判断点击是否发生在侧边栏外
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 控制移动端侧边栏的开关状态

  // 页面加载或筛选条件变化时，重新拉取商品数据
  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  // 点击筛选按钮时切换侧边栏显示
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 监听鼠标点击事件，如果点击在侧边栏外则自动关闭
  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  // 添加和移除鼠标点击监听事件
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* ✅ 移动端筛选按钮 */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border border-[#1F7D53] text-[#1F7D53] rounded-md px-4 py-2 flex items-center justify-center mb-4 ml-4 w-fit"
      >
        <FaFilter className="mr-2" /> 筛选条件
      </button>

      {/* ✅ 左侧筛选栏（移动端可切换） */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>

      {/* ✅ 主体内容区 */}
      <div className="flex-grow p-4">
        {/* 标题 */}
        <h2 className="text-2xl font-bold text-[#1F7D53] mb-6">全部商品</h2>

        {/* 排序选项（组件内可能包含：价格从低到高、最新上架等） */}
        <SortOptions />

        {/* 商品网格展示区 */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage; // 导出组件供页面使用
// 该组件用于展示商品集合页，包含筛选、排序和商品列表功能
