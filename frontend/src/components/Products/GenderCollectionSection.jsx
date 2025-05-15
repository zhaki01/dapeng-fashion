// GenderCollectionSection.jsx
// ✅ 性别和分类系列展示组件
// 用于首页展示“女士系列”、“男士系列”、“上装系列”、“下装系列”的推荐入口
// 每个模块包含图片、标题和跳转链接，提升用户快速浏览体验

import { Link } from "react-router-dom"; // 用于前端跳转路由
import mensCollectionImage from "../../assets/5.png"; // 男士系列图片
import womensCollectionImage from "../../assets/4.png"; // 女士系列图片
import topsImage from "../../assets/2.png"; // 上装系列图片
import bottomsImage from "../../assets/6.png"; // 下装系列图片

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      {/* 使用网格布局将 4 个系列并排展示（在中等及以上屏幕） */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 👩 女士系列 */}
        <div className="relative group overflow-hidden rounded-2xl shadow-md">
          <img
            src={womensCollectionImage}
            alt="Women's Collection"
            className="w-full h-[500px] object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
          />
          {/* 半透明遮罩层 */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300"></div>
          {/* 底部标题和按钮 */}
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 rounded-lg p-5 backdrop-blur-sm shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              → 女士系列
            </h2>
            <Link
              to="/collections/all?gender=女士"
              className="text-sm font-medium text-gray-800 underline hover:text-black transition"
            >
              立即购买
            </Link>
          </div>
        </div>

        {/* 👨 男士系列 */}
        <div className="relative group overflow-hidden rounded-2xl shadow-md">
          <img
            src={mensCollectionImage}
            alt="Men's Collection"
            className="w-full h-[500px] object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300"></div>
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 rounded-lg p-5 backdrop-blur-sm shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              → 男士系列
            </h2>
            <Link
              to="/collections/all?gender=男士"
              className="text-sm font-medium text-gray-800 underline hover:text-black transition"
            >
              立即购买
            </Link>
          </div>
        </div>

        {/* 👕 上装系列 */}
        <div className="relative group overflow-hidden rounded-2xl shadow-md">
          <img
            src={topsImage}
            alt="Tops Collection"
            className="w-full h-[500px] object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300"></div>
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 rounded-lg p-5 backdrop-blur-sm shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              → 上装系列
            </h2>
            <Link
              to="/collections/all?category=上装"
              className="text-sm font-medium text-gray-800 underline hover:text-black transition"
            >
              立即购买
            </Link>
          </div>
        </div>

        {/* 👖 下装系列 */}
        <div className="relative group overflow-hidden rounded-2xl shadow-md">
          <img
            src={bottomsImage}
            alt="Bottoms Collection"
            className="w-full h-[500px] object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300"></div>
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 rounded-lg p-5 backdrop-blur-sm shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              → 下装系列
            </h2>
            <Link
              to="/collections/all?category=下装"
              className="text-sm font-medium text-gray-800 underline hover:text-black transition"
            >
              立即购买
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection; // ✅ 导出首页展示组件
