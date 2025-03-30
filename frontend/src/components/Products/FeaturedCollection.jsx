//   FeaturedCollection;
//   ├── FeaturedCollection.jsx
//   ├── ProductGrid.jsx
//   ├── ProductCard.jsx
//   └── index.js
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProductsByPreference } from "../../redux/slices/productsSlice";
import ProductGrid from "./ProductGrid"; // 你已经有这个组件用于展示产品卡片
// 🔼 FeaturedCollection.jsx 顶部
import featured from "../../assets/clother33.png";
import { Link } from "react-router-dom";
const FeaturedCollection = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsByPreference());
  }, [dispatch]);

  return (
    <>
      {/* 原有 Featured Collection 内容 */}
      <section className="py-16 px-4 lg:px-0">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-[#F2F9F6] rounded-3xl overflow-hidden shadow-md">
          {/* Left Content */}
          <div className="lg:w-1/2 p-10 text-center lg:text-left">
            <h2 className="text-md font-semibold text-[#255F38] mb-3 tracking-wide">
              日常舒适 · 精致穿搭
            </h2>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1F7D53] mb-6 leading-tight">
              打造适合每一天的理想穿搭
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              精选高品质舒适面料，结合实穿性与时尚感，
              让你在日常生活中也能穿出风格与质感。
            </p>
            <Link
              to="/collections/all"
              className="inline-block bg-[#1F7D53] hover:bg-[#255F38] text-white px-6 py-3 rounded-full text-lg transition"
            >
              立即选购
            </Link>
          </div>

          {/* Right Content */}
          <div className="lg:w-1/2 overflow-hidden group">
            <div className="relative w-full h-full">
              <img
                src={featured}
                alt="推荐系列"
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-white/0 to-white/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ 新增：根据偏好推荐
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <h2 className="text-2xl text-center font-bold text-[#1F7D53] mb-6">
          为你推荐的风格
        </h2>
        <ProductGrid products={products} />
      </section> */}
    </>
  );
};

export default FeaturedCollection;
