// 加注释
// EditProductPage.jsx
// 编辑商品页面组件
// 该组件用于编辑商品信息，包括名称、描述、价格、库存数量、SKU、尺码、颜色等
// 该组件使用了 Redux 来管理状态，并使用了 React Router 来处理路由
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProductDetails,
  updateProduct,
} from "../../redux/slices/productsSlice";
// import axios from "axiosInstance"; // 确保 axios 实例已配置好
// import axiosInstance from "../../axiosConfig"; // 确保 axios 实例已配置好
// /Users/imac/Documents/Dapeng-main/frontend/axiosConfig.js
import axiosInstance from "@/utils/axiosConfig";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) setProductData(selectedProduct);
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-md">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-green-800">编辑商品信息</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold mb-1">商品名称</label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">商品描述</label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">价格</label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">库存数量</label>
                <input
                  type="number"
                  name="countInStock"
                  value={productData.countInStock}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={productData.sku}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                尺码（逗号分隔）
              </label>
              <input
                type="text"
                name="sizes"
                value={productData.sizes.join(", ")}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    sizes: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                颜色（逗号分隔）
              </label>
              <input
                type="text"
                name="colors"
                value={productData.colors.join(", ")}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    colors: e.target.value.split(",").map((c) => c.trim()),
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">上传图片</label>
              <input type="file" onChange={handleImageUpload} />
              {uploading && (
                <p className="text-sm text-gray-500">正在上传...</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3">
                {productData.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={img.altText || "image"}
                    className="w-20 h-20 rounded-md object-cover shadow"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
            >
              保存修改
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-white rounded-2xl p-6 flex flex-col justify-center items-center">
          <h3 className="text-xl font-semibold text-green-800 mb-4">
            预览图像
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {productData.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt="预览图"
                className="w-full h-32 object-cover rounded-lg shadow-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
