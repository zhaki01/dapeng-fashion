//  FilterSidebar.jsx
//  FilterSidebar;
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    collections: [],
    minPrice: 0,
    maxPrice: 900,
  });
  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ["上装", "下装"];
  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = [
    "棉",
    "棉混纺",
    "牛仔布",
    "人造丝",
    "抓绒",
    "聚酯纤维",
    "亚麻混纺",
    "真丝混纺",
    "羊毛混纺",
  ];
  const brands = [
    "都市线条",
    "现代合身",
    "街头风格",
    "海风度假",
    "都市时尚",
    "Polo经典",
    "街头节奏",
    "传承系列",
    "冬日基础款",
    "每日舒适",
    "活力穿搭",
    "都市风格",
    "轻松时光",
    "牛仔工坊",
    "休闲风尚",
    "运动先锋",
    "绅士格调",
    "街头穿搭",
    "居家舒适",
    "优雅风尚",
    "牛仔时尚",
    "优雅穿搭",
    "舒适合身",
    "阳光风尚",
    "牛仔风格",
    "优雅风格",
    "针织风尚",
    "波西气息",
    "舒适T恤",
    "优雅气质",
    "柔美衣语",
    "女性风尚",
    "经典风格",
    "优雅交叠",
  ];
  const genders = ["男士", "女士"];

  const collections = [
    "商务休闲",
    "正式穿搭",
    "休闲穿搭",
    "度假穿搭",
    "商务穿搭",
    "街头风",
    "冬季必备",
    "基础款",
    "休闲系列",
    "都市系列",
    "智能休闲系列",
    "运动系列",
    "职场穿搭",
    "街头风格系列",
    "居家系列",
    "正式系列",
    "春季系列",
    "夏季系列",
    "针织系列",
    "内衣灵感系列",
    "基础系列",
    "晚装系列",
    "秋季系列",
    "职场系列",
  ];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      collections: params.collections ? params.collections.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 100,
    });
    setPriceRange([0, params.maxPrice || 100]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };
    if (type === "checkbox") {
      newFilters[name] = checked
        ? [...(newFilters[name] || []), value]
        : newFilters[name].filter((item) => item !== value);
    } else {
      newFilters[name] = value;
    }
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  return (
    <div className="p-4 text-sm">
      <h3 className="text-xl font-semibold text-[#1F7D53] mb-6">筛选条件</h3>

      {/* Category */}
      <div className="mb-6">
        <label className="block text-[#27391C] font-medium mb-2">分类</label>
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center mb-1 text-gray-700"
          >
            <input
              type="radio"
              name="category"
              value={category}
              checked={filters.category === category}
              onChange={handleFilterChange}
              className="mr-2 text-[#1F7D53] focus:ring-[#255F38]"
            />
            {category}
          </label>
        ))}
      </div>

      {/* Gender */}
      <div className="mb-6">
        <label className="block text-[#27391C] font-medium mb-2">性别</label>
        {genders.map((gender) => (
          <label key={gender} className="flex items-center mb-1 text-gray-700">
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={filters.gender === gender}
              onChange={handleFilterChange}
              className="mr-2 text-[#1F7D53] focus:ring-[#255F38]"
            />
            {gender}
          </label>
        ))}
      </div>

      {/* Color */}
      <div className="mb-6">
        <label className="block text-[#27391C] font-medium mb-2">颜色</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              name="color"
              value={color}
              onClick={handleFilterChange}
              className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${
                filters.color === color ? "ring-2 ring-[#1F7D53]" : ""
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
            ></button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <label className="block text-[#27391C] font-medium mb-2">尺码</label>
        {sizes.map((size) => (
          <label key={size} className="flex items-center mb-1 text-gray-700">
            <input
              type="checkbox"
              name="size"
              value={size}
              checked={filters.size.includes(size)}
              onChange={handleFilterChange}
              className="mr-2 text-[#1F7D53] focus:ring-[#255F38]"
            />
            {size}
          </label>
        ))}
      </div>

      {/* Material */}
      <div className="mb-6">
        <label className="block text-[#27391C] font-medium mb-2">面料</label>
        {materials.map((material) => (
          <label
            key={material}
            className="flex items-center mb-1 text-gray-700"
          >
            <input
              type="checkbox"
              name="material"
              value={material}
              checked={filters.material.includes(material)}
              onChange={handleFilterChange}
              className="mr-2 text-[#1F7D53] focus:ring-[#255F38]"
            />
            {material}
          </label>
        ))}
      </div>

      {/* Brand */}
      <div className="mb-6">
        <label className="block text-[#27391C] font-medium mb-2">品牌</label>
        {brands.map((brand) => (
          <label key={brand} className="flex items-center mb-1 text-gray-700">
            <input
              type="checkbox"
              name="brand"
              value={brand}
              checked={filters.brand.includes(brand)}
              onChange={handleFilterChange}
              className="mr-2 text-[#1F7D53] focus:ring-[#255F38]"
            />
            {brand}
          </label>
        ))}
      </div>

      {/* Collections */}
      <div className="mb-6">
        <label className="block text-[#27391C] font-medium mb-2">系列</label>
        {collections.map((collection) => (
          <label
            key={collection}
            className="flex items-center mb-1 text-gray-700"
          >
            <input
              type="checkbox"
              name="collections"
              value={collection}
              checked={filters.collections.includes(collection)}
              onChange={handleFilterChange}
              className="mr-2 text-[#1F7D53] focus:ring-[#255F38]"
            />
            {collection}
          </label>
        ))}
      </div>

      {/* Price */}
      <div className="mb-10">
        <label className="block text-[#27391C] font-medium mb-2">
          价格范围
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full accent-[#1F7D53]"
        />
        <div className="flex justify-between text-gray-700 text-sm mt-2">
          <span>￥0</span>
          <span>￥{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
