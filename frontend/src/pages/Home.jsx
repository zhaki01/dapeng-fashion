// src/pages/Home.jsx
// 首页组件：展示轮播图、精选商品、热销商品、新品推荐等模块

import React, { useEffect, useState } from "react";

// 引入页面各个模块组件
import Hero from "../components/Layout/Hero";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductGrid from "../components/Products/ProductGrid";
import RecommendedSection from "../components/Products/RecommendedSection";

// Redux 调度与商品请求
import { useDispatch } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";

// axios 请求工具（已配置 baseURL）
import axiosInstance from "../utils/axiosConfig";

const Home = () => {
  const dispatch = useDispatch();

  // 定义本地状态：分别保存女士精选、男士精选、热销商品
  const [femaleProducts, setFemaleProducts] = useState([]);
  const [maleProducts, setMaleProducts] = useState([]);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  // 各类商品的 loading / error 状态
  const [loadingFemale, setLoadingFemale] = useState(false);
  const [loadingMale, setLoadingMale] = useState(false);
  const [loadingBestSeller, setLoadingBestSeller] = useState(false);
  const [errorFemale, setErrorFemale] = useState(null);
  const [errorMale, setErrorMale] = useState(null);
  const [errorBestSeller, setErrorBestSeller] = useState(null);

  // 页面加载时拉取数据
  useEffect(() => {
    // 获取“女士下装”精选
    setLoadingFemale(true);
    dispatch(
      fetchProductsByFilters({
        gender: "女士",
        category: "下装",
        limit: 8,
      })
    )
      .unwrap()
      .then((data) => {
        setFemaleProducts(data); // 成功后更新数据
        setLoadingFemale(false);
      })
      .catch((err) => {
        setErrorFemale(err.message || "获取女士产品失败");
        setLoadingFemale(false);
      });

    // 获取“男士上装”精选
    setLoadingMale(true);
    dispatch(
      fetchProductsByFilters({
        gender: "男士",
        category: "上装",
        limit: 8,
      })
    )
      .unwrap()
      .then((data) => {
        setMaleProducts(data);
        setLoadingMale(false);
      })
      .catch((err) => {
        setErrorMale(err.message || "获取男生产品失败");
        setLoadingMale(false);
      });

    // 获取热销商品（后台返回销售量最高的单品）
    setLoadingBestSeller(true);
    const fetchBestSeller = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data); // 成功保存热销商品
        setLoadingBestSeller(false);
      } catch (error) {
        console.error(error);
        setErrorBestSeller(error.message || "获取热销商品失败");
        setLoadingBestSeller(false);
      }
    };

    fetchBestSeller(); // 执行热销商品拉取
  }, [dispatch]);

  return (
    <div>
      {/* 顶部轮播图 */}
      <Hero />

      {/* 性别系列导航组件 */}
      <GenderCollectionSection />

      {/* 最新上架商品 */}
      <NewArrivals />

      {/* 热销商品模块 */}
      <div className="bg-[#F8F8F8] container max-w-7xl mx-auto p-8 rounded-3xl shadow-md mb-6">
        <h2 className="text-3xl text-center font-bold mb-6">🔥 热销商品</h2>
        {loadingBestSeller ? (
          <p className="text-center text-gray-600">加载中，请稍候...</p>
        ) : errorBestSeller ? (
          <p className="text-center text-red-500">{errorBestSeller}</p>
        ) : bestSellerProduct ? (
          // 使用 ProductGrid 展示单个热销商品（作为数组传入）
          <ProductGrid products={[bestSellerProduct]} />
        ) : (
          <p className="text-center text-gray-600">暂无热销商品</p>
        )}
      </div>

      {/* 女士精选模块 */}
      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">女士精选</h2>
        {loadingFemale ? (
          <p className="text-center text-gray-600">加载中，请稍候...</p>
        ) : errorFemale ? (
          <p className="text-center text-red-500">{errorFemale}</p>
        ) : (
          <ProductGrid products={femaleProducts} />
        )}
      </div>

      {/* 男士精选模块 */}
      <div className="container mx-auto mt-8">
        <h2 className="text-3xl text-center font-bold mb-4">男士精选</h2>
        {loadingMale ? (
          <p className="text-center text-gray-600">加载中，请稍候...</p>
        ) : errorMale ? (
          <p className="text-center text-red-500">{errorMale}</p>
        ) : (
          <ProductGrid products={maleProducts} />
        )}
      </div>

      {/* 精选集合、品牌特色、AI 推荐模块 */}
      <FeaturedCollection />
      <FeaturesSection />
      <RecommendedSection />
    </div>
  );
};

export default Home; // 导出首页组件供路由使用
