// File: src/components/Products/RecommendedSection.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../../redux/slices/productsSlice";
import ProductGrid from "./ProductGrid";

const RecommendedSection = () => {
  const dispatch = useDispatch();
  const { recommendations, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  const isEmpty = !loading && !error && recommendations.length === 0;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <h2 className="text-3xl font-bold text-[#1F7D53] text-center mb-8">
        为你推荐的风格
      </h2>

      {loading && <p className="text-center">加载中…</p>}
      {error && <p className="text-center text-red-500">错误：{error}</p>}

      {!loading &&
        !error &&
        (isEmpty ? (
          <p className="text-center text-gray-500">
            暂无推荐内容，快去浏览/收藏/购买吧！
          </p>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <ProductGrid products={recommendations} />
          </div>
        ))}
    </section>
  );
};

export default RecommendedSection;
