// SortOptions.jsx
// 引入 React Router 提供的钩子，用于获取和更新 URL 查询参数（例如 ?sortBy=priceAsc）
import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
  // 获取当前的 URL 查询参数和用于更新它的函数
  const [searchParams, setSearchParams] = useSearchParams();

  // 当用户选择不同的排序方式时触发
  const handleSortChange = (e) => {
    const sortBy = e.target.value; // 获取下拉选择的值
    searchParams.set("sortBy", sortBy); // 设置查询参数 sortBy
    setSearchParams(searchParams); // 更新 URL，使前端或后端能读取该参数进行排序
  };

  return (
    <div className="mb-6 flex items-center justify-end">
      {/* 排序方式标签 */}
      <label htmlFor="sort" className="mr-2 text-sm text-gray-700">
        排序方式：
      </label>

      {/* 下拉选择排序方式 */}
      <select
        id="sort"
        onChange={handleSortChange} // 监听用户选择变化
        value={searchParams.get("sortBy") || ""} // 当前选中的值从 URL 参数中读取
        className="border border-gray-300 p-2 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F7D53]"
      >
        <option value="">默认排序</option> {/* 不设定任何排序 */}
        <option value="priceAsc">价格从低到高</option> {/* 升序排序 */}
        <option value="priceDesc">价格从高到低</option> {/* 降序排序 */}
        <option value="popularity">人气优先</option> {/* 根据热度排序 */}
      </select>
    </div>
  );
};

// 导出排序组件，供其他页面调用
export default SortOptions;
