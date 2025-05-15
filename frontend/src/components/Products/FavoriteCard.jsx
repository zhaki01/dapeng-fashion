// FavoriteCard.jsx
// ✅ 收藏商品卡片组件（FavoriteCard）
// 本组件用于在收藏页面中显示用户收藏的单个商品信息
// 包含商品图片、名称、价格，以及取消收藏按钮

import React from "react";
import { Link } from "react-router-dom"; // 用于跳转到商品详情页
import { AiOutlineClose } from "react-icons/ai"; // 关闭图标（用于取消收藏）

// 接收两个参数：favorite（收藏记录对象）、onRemove（取消收藏回调函数）
const FavoriteCard = ({ favorite, onRemove }) => {
  // 从收藏记录中提取 product 信息
  const product = favorite.product;

  // ✅ 如果商品没有图片，则使用占位图（避免页面空白）
  const defaultImage = "https://via.placeholder.com/300x300?text=No+Image";
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url // 有图则用第一张图
      : defaultImage; // 否则用默认占位图

  // ✅ 图片的备用描述文字（alt），优先使用 altText，没有就用商品名称
  const altText =
    product.images && product.images.length > 0
      ? product.images[0].altText || product.name
      : product.name;

  return (
    // ✅ 卡片容器，带圆角、阴影、裁切溢出内容
    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden">
      {/* ✅ 点击卡片跳转到对应商品详情页 */}
      <Link to={`/product/${product._id}`} className="block">
        {/* ✅ 商品图片展示区域 */}
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-64 object-cover"
        />

        {/* ✅ 商品名称和价格信息区域 */}
        <div className="p-4">
          <h3 className="text-md font-semibold text-[#27391C] truncate">
            {product.name}
          </h3>
          <p className="text-[#255F38] font-medium text-sm mt-1">
            ￥{product.price}
          </p>
        </div>
      </Link>

      {/* ✅ 取消收藏按钮，点击后调用 onRemove 函数，传入收藏记录 ID */}
      <button
        onClick={() => onRemove(favorite._id)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
      >
        <AiOutlineClose className="w-5 h-5" />
      </button>
    </div>
  );
};

// ✅ 导出组件，供其他页面（如收藏列表页）使用
export default FavoriteCard;
