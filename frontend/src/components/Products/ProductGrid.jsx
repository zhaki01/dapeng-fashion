// src/components/Products/ProductGrid.jsx
import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p>加载中...</p>;
  }

  if (error) {
    return <p>错误：{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products &&
        products.map((product, index) => {
          // 如果产品没有图片，则使用一个默认的占位图片
          const defaultImage =
            "https://via.placeholder.com/300x300?text=No+Image";
          const imageUrl =
            product.images && product.images.length > 0
              ? product.images[0].url
              : defaultImage;
          const altText =
            product.images && product.images.length > 0
              ? product.images[0].altText || product.name
              : product.name;

          return (
            <Link
              key={index}
              to={`/product/${product._id}`}
              className="block group transition duration-300"
            >
              <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="relative w-full h-96 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={altText}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18230F]/60 via-transparent to-transparent"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-md font-semibold text-[#27391C] group-hover:text-[#1F7D53] truncate">
                    {product.name}
                  </h3>
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

export default ProductGrid;
