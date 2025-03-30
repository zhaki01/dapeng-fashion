// FavoriteCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";

const FavoriteCard = ({ favorite, onRemove }) => {
  // favorite: { _id, product }
  const product = favorite.product;
  // 如果没有图片，则使用默认占位图片
  const defaultImage = "https://via.placeholder.com/300x300?text=No+Image";
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url
      : defaultImage;
  const altText =
    product.images && product.images.length > 0
      ? product.images[0].altText || product.name
      : product.name;

  return (
    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden">
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-md font-semibold text-[#27391C] truncate">
            {product.name}
          </h3>
          <p className="text-[#255F38] font-medium text-sm mt-1">
            ￥{product.price}
          </p>
        </div>
      </Link>
      {/* 取消收藏按钮 */}
      <button
        onClick={() => onRemove(favorite._id)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
      >
        <AiOutlineClose className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FavoriteCard;
