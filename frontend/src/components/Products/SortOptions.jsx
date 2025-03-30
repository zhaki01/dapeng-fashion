// SortOptions.jsx
import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy);
    setSearchParams(searchParams);
  };

  return (
    <div className="mb-6 flex items-center justify-end">
      <label htmlFor="sort" className="mr-2 text-sm text-gray-700">
        排序方式：
      </label>
      <select
        id="sort"
        onChange={handleSortChange}
        value={searchParams.get("sortBy") || ""}
        className="border border-gray-300 p-2 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F7D53]"
      >
        <option value="">默认排序</option>
        <option value="priceAsc">价格从低到高</option>
        <option value="priceDesc">价格从高到低</option>
        <option value="popularity">人气优先</option>
      </select>
    </div>
  );
};

export default SortOptions;
