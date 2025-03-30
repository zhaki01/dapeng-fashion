// src/components/Products/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
// import axiosInstance from "../../axiosConfig"; // 确保 axios 实例已配置好
import axiosInstance from "@/utils/axiosConfig";
const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // 最终使用的产品 id
  const productFetchId = productId || id;

  // 点击收藏按钮
  const handleFavorite = async () => {
    if (!user) {
      navigate("/login?redirect=" + window.location.pathname);
      return;
    }
    try {
      if (!isFavorite) {
        const res = await axiosInstance.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/favorites`,
          { productId: productFetchId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        setIsFavorite(true);
        toast.success("收藏成功", { duration: 1000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("收藏失败，请稍后再试");
    }
  };

  // 获取产品详情及相似产品
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  // 设置主图片
  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  // 记录浏览历史：只有当用户已登录且产品 id 存在时触发
  useEffect(() => {
    if (!user || !productFetchId) return;
    const token = user.token || localStorage.getItem("userToken"); // 如果 Redux 中没有 token，则从 localStorage 中获取
    if (!token) return; // 没有 token 就直接返回

    const recordViewHistory = async () => {
      try {
        console.log("正在记录浏览历史", {
          userId: user._id,
          productId: productFetchId,
        });
        const response = await axiosInstance.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/history/view`,
          { productId: productFetchId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("浏览记录保存成功:", response.data);
      } catch (error) {
        console.error("浏览记录保存失败:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }
    };
    recordViewHistory();
  }, [user, productFetchId]);

  // 处理数量变化
  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  // 处理加入购物车
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("请先选择尺码和颜色再加入购物车", { duration: 1000 });
      return;
    }
    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("已添加至购物车", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) return <p>加载中...</p>;
  if (error) return <p className="text-red-500">出错啦：{error}</p>;

  return (
    <div className="p-6 bg-[#F8F8F8]">
      {selectedProduct && (
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-3xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 图片展示区域 */}
            <div>
              <div className="flex gap-4 mb-4 overflow-x-auto md:flex-col md:overflow-visible">
                {selectedProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImage === image.url
                        ? "border-[#1F7D53]"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(image.url)}
                  />
                ))}
              </div>
              <div>
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="w-full h-[500px] object-cover rounded-2xl shadow"
                />
              </div>
            </div>

            {/* 产品信息区域 */}
            <div>
              <h1 className="text-3xl font-bold text-[#18230F] mb-4">
                {selectedProduct.name}
              </h1>
              <p className="text-lg text-gray-400 line-through">
                {selectedProduct.originalPrice &&
                  `$${selectedProduct.originalPrice}`}
              </p>
              <p className="text-2xl text-[#27391C] mb-4 font-semibold">
                $ {selectedProduct.price}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* 颜色选择 */}
              <div className="mb-6">
                <p className="text-[#255F38] font-medium mb-2">🎨 颜色：</p>
                <div className="flex gap-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColor === color
                          ? "border-4 border-[#1F7D53]"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        filter: "brightness(0.9)",
                      }}
                    ></button>
                  ))}
                </div>
              </div>

              {/* 尺码选择 */}
              <div className="mb-6">
                <p className="text-[#255F38] font-medium mb-2">📏 尺码：</p>
                <div className="flex gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full border ${
                        selectedSize === size
                          ? "bg-[#1F7D53] text-white"
                          : "text-[#18230F] border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* 数量选择 */}
              <div className="mb-6">
                <p className="text-[#255F38] font-medium mb-2">🔢 数量：</p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="px-3 py-1 bg-gray-200 rounded-full text-xl"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-3 py-1 bg-gray-200 rounded-full text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 加入购物车 */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`w-full py-3 rounded-full text-white font-semibold text-lg transition ${
                  isButtonDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#1F7D53] hover:bg-[#255F38]"
                }`}
              >
                {isButtonDisabled ? "正在添加..." : "加入购物车"}
              </button>

              {/* 收藏按钮 */}
              <button
                onClick={handleFavorite}
                className="w-full mt-4 py-3 rounded-full text-white font-semibold text-lg transition bg-[#e63946] hover:bg-[#d62828]"
              >
                {isFavorite ? (
                  <AiFillHeart className="inline-block mr-2" />
                ) : (
                  <AiOutlineHeart className="inline-block mr-2" />
                )}
                {isFavorite ? "已收藏" : "加入收藏"}
              </button>

              {/* 产品其他信息 */}
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4 text-[#27391C]">
                  Characteristics:
                </h3>
                <table className="w-full text-left text-sm">
                  <tbody>
                    <tr>
                      <td className="py-1">🏷 品牌</td>
                      <td className="py-1">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">🧵 材质</td>
                      <td className="py-1">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 相似产品 */}
          <div className="mt-20">
            <h2 className="text-2xl text-center font-semibold mb-6 text-[#1F7D53]">
              ✨ 猜你喜欢
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
