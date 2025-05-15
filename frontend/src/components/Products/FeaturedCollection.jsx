// FeaturedCollection.jsx
// ✅ 推荐系列展示组件（FeaturedCollection）
// 本组件用于首页展示品牌主推系列内容，并调用“基于用户偏好推荐的商品列表”
// 左侧为宣传文案，右侧为图片展示，下方可选展示用户个性推荐（调用 ProductGrid）

import { useDispatch, useSelector } from "react-redux"; // Redux：派发动作、读取状态
import { useEffect } from "react"; // React Hook：组件加载时触发
import { fetchProductsByPreference } from "../../redux/slices/productsSlice"; // 获取用户偏好商品的 action
import ProductGrid from "./ProductGrid"; // ✅ 展示商品网格组件（商品卡片布局）
import featured from "../../assets/clother33.png"; // 图片资源
import { Link } from "react-router-dom"; // 用于跳转链接

const FeaturedCollection = () => {
  const dispatch = useDispatch(); // 获取 dispatch 派发函数
  const { products } = useSelector((state) => state.products); // 从 Redux 状态中读取商品列表

  // ✅ 页面加载时，从后端获取用户偏好推荐商品
  useEffect(() => {
    dispatch(fetchProductsByPreference());
  }, [dispatch]);

  return (
    <>
      {/* ✅ 推荐系列主展示区域（左右布局） */}
      <section className="py-16 px-4 lg:px-0">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-[#F2F9F6] rounded-3xl overflow-hidden shadow-md">
          {/* ✅ 左侧内容：标题 + 描述 + 按钮 */}
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
            {/* ✅ 按钮：跳转到商品集合页 */}
            <Link
              to="/collections/all"
              className="inline-block bg-[#1F7D53] hover:bg-[#255F38] text-white px-6 py-3 rounded-full text-lg transition"
            >
              立即选购
            </Link>
          </div>

          {/* ✅ 右侧图片展示区域（带放大动画效果） */}
          <div className="lg:w-1/2 overflow-hidden group">
            <div className="relative w-full h-full">
              <img
                src={featured}
                alt="推荐系列"
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
              />
              {/* ✅ 右图叠加浅色渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-white/0 to-white/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ 用户偏好推荐区域（可启用） */}
      {/* 
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <h2 className="text-2xl text-center font-bold text-[#1F7D53] mb-6">
          为你推荐的风格
        </h2>
        <ProductGrid products={products} />
      </section> 
      */}
    </>
  );
};

export default FeaturedCollection; // ✅ 导出组件供首页调用
