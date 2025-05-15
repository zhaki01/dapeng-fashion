// CreateProductPage.jsx
// ✅ 商品添加页面组件
// 用于管理员添加新商品，包含表单输入、图片上传、提交等功能
import { useState } from "react";
import axiosInstance from "@/utils/axiosConfig"; // 封装过的 Axios 实例（带基础配置）
import { useNavigate } from "react-router-dom"; // 页面跳转 Hook

const CreateProductPage = () => {
  const navigate = useNavigate(); // 用于页面跳转到商品管理页面

  // 定义商品信息的初始状态
  const [productData, setProductData] = useState({
    name: "", // 商品名称
    description: "", // 商品描述
    price: 0, // 原价
    discountPrice: 0, // 折扣价
    countInStock: 0, // 库存数量
    sku: "", // 商品唯一 SKU 编号
    category: "", // 商品分类
    brand: "", // 品牌
    sizes: [], // 尺码列表（数组形式）
    colors: [], // 颜色列表（数组形式）
    collections: "", // 所属系列
    material: "", // 面料材质
    gender: "", // 适用性别
    images: [], // 图片数组（每个对象包含 url 和 altText）
    rating: 0, // 评分（默认 0）
    numReviews: 0, // 评论数量（默认 0）
  });

  // 处理输入框变动，更新 productData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // 处理图片上传逻辑
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // 获取上传的文件
    const formData = new FormData(); // 创建 FormData 对象
    formData.append("image", file); // 添加图片字段

    try {
      // 发送上传请求
      const { data } = await axiosInstance.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 将返回的图片地址添加到 productData 中
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
    } catch (err) {
      console.error("图片上传失败", err);
    }
  };

  // 提交表单，向后端添加新商品
  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止表单默认刷新行为
    try {
      // 发送 POST 请求，将商品数据提交至后端
      await axiosInstance.post("/api/admin/products", productData);
      navigate("/admin/products"); // 添加成功后跳转到商品管理页面
    } catch (error) {
      console.error("添加失败", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">添加新商品</h2>

      {/* 商品添加表单 */}
      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* 商品名称 */}
        <input
          type="text"
          name="name"
          placeholder="商品名称"
          onChange={handleChange}
          required
        />

        {/* 商品描述 */}
        <textarea
          name="description"
          placeholder="商品描述"
          onChange={handleChange}
          required
        />

        {/* 商品价格 */}
        <input
          type="number"
          name="price"
          placeholder="价格"
          onChange={handleChange}
        />

        {/* 折扣价 */}
        <input
          type="number"
          name="discountPrice"
          placeholder="折扣价"
          onChange={handleChange}
        />

        {/* 库存数量 */}
        <input
          type="number"
          name="countInStock"
          placeholder="库存数量"
          onChange={handleChange}
        />

        {/* SKU 编号 */}
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          onChange={handleChange}
        />

        {/* 分类 */}
        <input
          type="text"
          name="category"
          placeholder="分类"
          onChange={handleChange}
        />

        {/* 品牌 */}
        <input
          type="text"
          name="brand"
          placeholder="品牌"
          onChange={handleChange}
        />

        {/* 尺码输入：使用逗号分隔 */}
        <input
          type="text"
          name="sizes"
          placeholder="尺码（用逗号分隔）"
          onChange={(e) =>
            setProductData({ ...productData, sizes: e.target.value.split(",") })
          }
        />

        {/* 颜色输入：使用逗号分隔 */}
        <input
          type="text"
          name="colors"
          placeholder="颜色（用逗号分隔）"
          onChange={(e) =>
            setProductData({
              ...productData,
              colors: e.target.value.split(","),
            })
          }
        />

        {/* 商品系列 */}
        <input
          type="text"
          name="collections"
          placeholder="系列"
          onChange={handleChange}
        />

        {/* 面料信息 */}
        <input
          type="text"
          name="material"
          placeholder="面料"
          onChange={handleChange}
        />

        {/* 适用性别 */}
        <select name="gender" onChange={handleChange}>
          <option value="">选择性别</option>
          <option value="男士">男士</option>
          <option value="女士">女士</option>
          <option value="男女通用">男女通用</option>
        </select>

        {/* 图片上传 */}
        <div>
          <label>上传图片</label>
          <input type="file" onChange={handleImageUpload} />

          {/* 图片预览 */}
          <div className="flex gap-4 mt-2 flex-wrap">
            {productData.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt="预览"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded"
        >
          添加商品
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage; // 导出组件，供路由或页面调用
