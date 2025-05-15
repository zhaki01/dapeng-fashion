// File: frontend/src/components/Products/NewArrivals.jsx
// ✅ 新品推荐组件（首页使用）
// 功能：展示最新上架的商品，并支持鼠标拖拽滑动和左右按钮滚动
// 使用 axiosInstance 调用后端接口获取新商品列表

import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // 左右箭头图标
import { Link } from "react-router-dom"; // 路由跳转组件
import axiosInstance from "@/utils/axiosConfig"; // 已封装好的 axios 实例

const NewArrivals = () => {
  const scrollRef = useRef(null); // 用于获取滚动容器 DOM
  const [isDragging, setIsDragging] = useState(false); // 是否正在拖动
  const [startX, setStartX] = useState(0); // 拖动起点横坐标
  const [scrollLeft, setScrollLeft] = useState(false); // 拖动开始时的滚动位置
  const [canScrollLeft, setCanScrollLeft] = useState(false); // 是否可以左滚
  const [canScrollRight, setCanScrollRight] = useState(true); // 是否可以右滚

  const [newArrivals, setNewArrivals] = useState([]); // 新品商品列表

  // 页面加载后获取最新商品
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data); // 设置获取的数据
      } catch (error) {
        console.error(error); // 请求失败打印错误
      }
    };

    fetchNewArrivals();
  }, []);

  // 拖拽开始
  const handleMouseDown = (e) => {
    setIsDragging(true); // 开启拖拽状态
    setStartX(e.pageX - scrollRef.current.offsetLeft); // 记录初始点击位置
    setScrollLeft(scrollRef.current.scrollLeft); // 记录滚动条初始位置
  };

  // 拖拽中
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX; // 移动距离
    scrollRef.current.scrollLeft = scrollLeft - walk; // 更新滚动位置
  };

  // 拖拽结束
  const handleMouseUpOrLeave = () => {
    setIsDragging(false); // 关闭拖拽状态
  };

  // 点击左右按钮滚动
  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behaviour: "smooth" }); // 平滑滚动
  };

  // 判断左右按钮是否应启用
  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth;

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  // 页面首次渲染时设置监听器，并在滚动时判断按钮状态
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);

  return (
    <section className="py-20 px-4 lg:px-0 bg-[#F5F5F5]">
      {/* 顶部标题区域 */}
      <div className="container mx-auto mb-10 text-center relative">
        <h2 className="text-4xl font-bold text-[#1F7D53] mb-4">新品推荐</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto">
          发现最新上架的潮流单品，抓住时尚脉搏，让穿搭更有灵感。
        </p>

        {/* 左右滚动按钮 */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border shadow-md transition ${
              canScrollLeft
                ? "bg-[#1F7D53] text-white hover:bg-[#255F38]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`p-2 rounded-full border shadow-md transition ${
              canScrollRight
                ? "bg-[#1F7D53] text-white hover:bg-[#255F38]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* 商品卡片滚动区域 */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex gap-6 relative ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {/* 遍历新品商品列表并渲染每个商品卡片 */}
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[80%] sm:min-w-[50%] lg:min-w-[30%] relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
          >
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              className="w-full h-[480px] object-cover transform hover:scale-105 transition duration-500"
              draggable="false"
            />
            {/* 商品信息叠加层 */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#27391C]/80 backdrop-blur text-white p-5">
              <Link to={`/product/${product._id}`} className="block">
                <h4 className="font-semibold text-lg">{product.name}</h4>
                <p className="mt-1 text-sm">￥{product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
