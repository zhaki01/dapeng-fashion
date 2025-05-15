// 引入必要的库和工具
// ProductDetails.jsx
// File: src/components/Products/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { toast } from "sonner"; // 用于显示提示信息
import ProductGrid from "./ProductGrid"; // 商品卡片组件，用于显示推荐商品
import { useParams, useNavigate } from "react-router-dom"; // 路由工具
import { useDispatch, useSelector } from "react-redux"; // Redux 工具
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice"; // 获取商品详情和相似商品
import { addToCart } from "../../redux/slices/cartSlice"; // 添加到购物车
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // 收藏图标
import axiosInstance from "@/utils/axiosConfig"; // Axios 请求配置

// 接收外部传入的 productId（可选）
const ProductDetails = ({ productId }) => {
  const { id } = useParams(); // 从 URL 获取商品 ID
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 从 Redux 获取商品数据和用户信息
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  // 本地状态管理
  const [mainImage, setMainImage] = useState(""); // 当前展示的主图
  const [selectedSize, setSelectedSize] = useState(""); // 用户选择的尺码
  const [selectedColor, setSelectedColor] = useState(""); // 用户选择的颜色
  const [quantity, setQuantity] = useState(1); // 商品数量
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // 防止重复点击
  const [isFavorite, setIsFavorite] = useState(false); // 收藏状态

  const productFetchId = productId || id; // 确定最终用于获取数据的商品 ID

  // 用户点击收藏按钮
  const handleFavorite = async () => {
    if (!user) {
      navigate("/login?redirect=" + window.location.pathname); // 未登录跳转
      return;
    }
    try {
      if (!isFavorite) {
        await axiosInstance.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/favorites`,
          { productId: productFetchId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        setIsFavorite(true); // 更新收藏状态
        toast.success("收藏成功", { duration: 1000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("收藏失败，请稍后再试");
    }
  };

  // 获取商品详情和相似商品（首次加载时触发）
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  // 设置默认展示的主图
  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  // 记录浏览历史（仅限登录用户）
  useEffect(() => {
    if (!user || !productFetchId) return;
    const token = user.token || localStorage.getItem("userToken");
    if (!token) return;

    const recordViewHistory = async () => {
      try {
        await axiosInstance.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/history/view`,
          { productId: productFetchId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("浏览记录保存失败:", error);
      }
    };
    recordViewHistory();
  }, [user, productFetchId]);

  // 用户点击数量加减按钮
  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  // 用户点击“加入购物车”按钮
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("请先选择尺码和颜色再加入购物车", { duration: 1000 });
      return;
    }

    setIsButtonDisabled(true); // 防止重复点击

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

  // 加载中/出错处理
  if (loading) return <p>加载中...</p>;
  if (error) return <p className="text-red-500">出错啦：{error}</p>;

  return (
    <div className="p-6 bg-[#F8F8F8]">
      {selectedProduct && (
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-3xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 左侧：商品图片区域 */}
            <div>
              {/* 缩略图 */}
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
              {/* 主图 */}
              <img
                src={mainImage}
                alt="Main Product"
                className="w-full h-[500px] object-cover rounded-2xl shadow"
              />
            </div>

            {/* 右侧：商品信息区域 */}
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
              <p className="text-gray-600 mb-6">
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

              {/* 加入购物车按钮 */}
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

              {/* 产品规格表 */}
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4 text-[#27391C]">
                  产品信息
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

          {/* 相似商品推荐 */}
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
