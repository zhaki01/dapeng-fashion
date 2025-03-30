
// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
// import axios from "axios";
import axiosInstance from "../utils/axiosConfig"; // 确保 axios 实例已配置好
import RecommendedSection from "../components/Products/RecommendedSection";

const Home = () => {
  const dispatch = useDispatch();

  // 用于保存女士和男生的精选产品
  const [femaleProducts, setFemaleProducts] = useState([]);
  const [maleProducts, setMaleProducts] = useState([]);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  // loading/error 状态可以根据需要扩展，这里简单处理
  const [loadingFemale, setLoadingFemale] = useState(false);
  const [loadingMale, setLoadingMale] = useState(false);
  const [loadingBestSeller, setLoadingBestSeller] = useState(false);
  const [errorFemale, setErrorFemale] = useState(null);
  const [errorMale, setErrorMale] = useState(null);
  const [errorBestSeller, setErrorBestSeller] = useState(null);

  useEffect(() => {
    // 获取女士精选：这里以 "女士" 和 "下装" 为示例，可根据实际需求调整类别
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
        setFemaleProducts(data);
        setLoadingFemale(false);
      })
      .catch((err) => {
        setErrorFemale(err.message || "获取女士产品失败");
        setLoadingFemale(false);
      });

    // 获取男生精选：这里以 "男士" 和 "上装" 为示例
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

    // 获取热销商品（最佳销售产品）
    setLoadingBestSeller(true);
    const fetchBestSeller = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data);
        setLoadingBestSeller(false);
      } catch (error) {
        console.error(error);
        setErrorBestSeller(error.message || "获取热销商品失败");
        setLoadingBestSeller(false);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* 热销商品 */}
      <div className="bg-[#F8F8F8] container max-w-7xl mx-auto p-8 rounded-3xl shadow-md mb-6">
        <h2 className="text-3xl text-center font-bold mb-6">🔥 热销商品</h2>
        {loadingBestSeller ? (
          <p className="text-center text-gray-600">加载中，请稍候...</p>
        ) : errorBestSeller ? (
          <p className="text-center text-red-500">{errorBestSeller}</p>
        ) : bestSellerProduct ? (
          // 注意：这里采用 ProductDetails 展示单个热销产品
          <ProductGrid products={[bestSellerProduct]} />
        ) : (
          <p className="text-center text-gray-600">暂无热销商品</p>
        )}
      </div>

      {/* 女士上装精选 */}
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

      {/* 男生精选 */}
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

      <FeaturedCollection />
      <FeaturesSection />
      <RecommendedSection />
    </div>
  );
};

export default Home;
