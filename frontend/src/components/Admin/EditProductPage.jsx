// EditProductPage.jsx
// 📁 商品编辑页面组件
// 说明：该页面允许管理员对已有商品进行信息修改，如名称、描述、价格、库存、图片、尺码颜色等。
// 使用 Redux 管理商品状态，React Router 获取路由参数与导航，axios 上传图片至服务器。

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { useNavigate, useParams } from "react-router-dom"; // 用于路由跳转和参数读取

// 从 Redux 中导入操作商品详情和更新商品的方法
import {
  fetchProductDetails,
  updateProduct,
} from "../../redux/slices/productsSlice";

// 自定义的 Axios 实例（已配置 baseURL 和拦截器）
import axiosInstance from "@/utils/axiosConfig";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // 获取 URL 中的商品 ID

  // 从 Redux 中获取当前选中的商品信息、加载状态和错误信息
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  // 本地状态：编辑表单数据
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

  // 本地状态：控制图片上传加载状态
  const [uploading, setUploading] = useState(false);

  // 组件加载时获取商品详情
  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id)); // 根据 ID 请求商品数据
  }, [dispatch, id]);

  // 商品数据获取成功后填充到本地表单状态中
  useEffect(() => {
    if (selectedProduct) setProductData(selectedProduct);
  }, [selectedProduct]);

  // 表单通用输入处理函数
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  // 上传图片到后端（再由后端上传至 Cloudinary）
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // 选中的文件
    const formData = new FormData();
    formData.append("image", file); // 添加到表单数据中

    try {
      setUploading(true);
      const { data } = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // 上传成功后将新图片加入状态
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

  // 提交修改后的商品信息
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData })); // 触发更新操作
    navigate("/admin/products"); // 跳转回商品列表页面
  };

  // 加载中或出错状态提示
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // ✅ 页面主结构：表单 + 预览图
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-md">
        {/* 左侧表单区域 */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-green-800">编辑商品信息</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 商品名称输入框 */}
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

            {/* 商品描述输入框 */}
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

            {/* 价格和库存数量 */}
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

            {/* SKU 编号 */}
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

            {/* 尺码输入（用英文逗号分隔） */}
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

            {/* 颜色输入（用英文逗号分隔） */}
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

            {/* 上传商品图片 */}
            <div>
              <label className="block font-semibold mb-1">上传图片</label>
              <input type="file" onChange={handleImageUpload} />
              {uploading && (
                <p className="text-sm text-gray-500">正在上传...</p>
              )}
              {/* 图片缩略图预览 */}
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

            {/* 提交按钮 */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
            >
              保存修改
            </button>
          </form>
        </div>

        {/* 右侧图像预览区域 */}
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

// ✅ 导出该页面组件
export default EditProductPage;
