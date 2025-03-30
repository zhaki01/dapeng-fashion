// File: src/components/Products/RecommendedSection.jsx
// src/components/Products/RecommendedSection.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../../redux/slices/productsSlice";
import ProductGrid from "./ProductGrid";

const RecommendedSection = () => {
  const dispatch = useDispatch();
  const { recommendations, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <h2 className="text-2xl text-center font-bold text-[#1F7D53] mb-6">
        为你推荐的风格
      </h2>
      {loading ? (
        <p className="text-center">加载中...</p>
      ) : (
        <ProductGrid products={recommendations} />
      )}
    </section>
  );
};

export default RecommendedSection;
