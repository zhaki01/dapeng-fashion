// src/components/Products/ProductGrid.jsx
// 从 react-router-dom 中引入 Link 组件，用于跳转到商品详情页面
import { Link } from "react-router-dom";

// 定义 ProductGrid 组件，接收三个 props：products（商品列表）、loading（加载状态）、error（错误信息）
const ProductGrid = ({ products, loading, error }) => {
  // 如果正在加载数据，显示“加载中...”提示
  if (loading) {
    return <p>加载中...</p>;
  }

  // 如果发生错误，显示错误信息
  if (error) {
    return <p>错误：{error}</p>;
  }

  return (
    // 使用响应式 CSS 网格布局：1列（移动端）~ 4列（桌面端）
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products &&
        products.map((product, index) => {
          // 如果商品没有图片，则使用默认占位图片
          const defaultImage =
            "https://via.placeholder.com/300x300?text=No+Image";

          // 获取商品主图 URL（取第一张图）
          const imageUrl =
            product.images && product.images.length > 0
              ? product.images[0].url
              : defaultImage;

          // 获取图片的 alt 文本（优先使用 altText，没有就用商品名称）
          const altText =
            product.images && product.images.length > 0
              ? product.images[0].altText || product.name
              : product.name;

          return (
            // 每个商品项外层包裹一个 Link，可跳转到该商品的详情页
            <Link
              key={index} // 使用索引作为 key（建议使用更唯一的字段如 _id）
              to={`/product/${product._id}`} // 跳转地址
              className="block group transition duration-300"
            >
              {/* 商品卡片容器 */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
                {/* 商品图片区域 */}
                <div className="relative w-full h-96 overflow-hidden">
                  <img
                    src={imageUrl} // 图片地址
                    alt={altText} // 图片替代文本
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" // 悬停时放大效果
                  />
                  {/* 图片上叠加渐变遮罩，提高文字可读性 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18230F]/60 via-transparent to-transparent"></div>
                </div>

                {/* 商品文本信息区域 */}
                <div className="p-4">
                  {/* 商品名称：文字超出时自动截断 */}
                  <h3 className="text-md font-semibold text-[#27391C] group-hover:text-[#1F7D53] truncate">
                    {product.name}
                  </h3>

                  {/* 商品价格 */}
                  <p className="text-[#255F38] font-medium text-sm mt-1">
                    ￥{product.price}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

// 导出组件
export default ProductGrid;
