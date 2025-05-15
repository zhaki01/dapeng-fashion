// AddProductModal.jsx
// 📁 商品添加弹窗组件
// 说明：用于管理员在后台页面中通过表单形式快速添加新商品，包括文字信息、筛选项、图片上传等功能

import { useState } from "react";
import axiosInstance from "@/utils/axiosConfig"; // 自定义封装的 axios 实例，用于发送请求

// 引入所有表单下拉选项的静态配置项（如分类、品牌、尺码、颜色等）
import {
  categories,
  brands,
  sizes,
  colors,
  collections,
  materials,
  genders,
} from "@/constants/formOptions";

// 引入颜色中英文映射表
import { colorMap } from "@/constants/colorOptions";

// ✅ 组件定义，接收 onClose 函数用于关闭弹窗
const AddProductModal = ({ onClose }) => {
  // 设置商品表单的所有字段状态（受控组件）
  const [formData, setFormData] = useState({
    name: "", // 商品名称
    description: "", // 商品描述
    price: 0, // 原价
    discountPrice: 0, // 折扣价
    countInStock: 0, // 库存数量
    sku: "", // SKU 编号
    category: "", // 商品分类
    brand: "", // 品牌
    sizes: [], // 可选尺码（复选）
    colors: [], // 可选颜色（复选）
    collections: "", // 所属系列
    material: "", // 材质/面料
    gender: "", // 性别分类
    images: [], // 上传图片列表
  });

  // ✅ 单行输入变化处理函数（适用于 text/number/select）
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 多选项处理（如尺码、颜色）点击选中/取消选中
  const handleMultiSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((v) => v !== value)
        : [...prev[name], value],
    }));
  };

  // ✅ 图片上传处理逻辑（上传至 Cloudinary）
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formDataData = new FormData();
    formDataData.append("image", file); // 将选中的图片文件添加进 formData

    try {
      // 调用后端上传接口（/api/upload）
      const { data } = await axiosInstance.post("/api/upload", formDataData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 上传成功后，将图片 URL 添加到 images 数组中
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
    } catch (error) {
      console.error("图片上传失败", error);
    }
  };

  // ✅ 表单提交处理函数（发请求到后台创建新商品）
  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止默认刷新行为
    try {
      await axiosInstance.post("/api/admin/products", formData); // 发送商品数据
      alert("商品添加成功！");
      onClose(); // 关闭弹窗
      window.location.reload(); // 刷新页面，更新商品列表
    } catch (error) {
      console.error("添加失败", error);
    }
  };

  // ✅ 返回 UI 结构（弹窗表单组件）
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      {/* 弹窗容器 */}
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-3xl shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* 关闭按钮（右上角 ✕） */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* 弹窗标题 */}
        <h2 className="text-2xl font-bold mb-4">添加新商品</h2>

        {/* 表单开始 */}
        <form onSubmit={handleSubmit} className="grid gap-3">
          {/* 基本信息输入框 */}
          <input
            type="text"
            name="name"
            placeholder="商品名称"
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="商品描述"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="价格"
            onChange={handleChange}
          />
          <input
            type="number"
            name="discountPrice"
            placeholder="折扣价"
            onChange={handleChange}
          />
          <input
            type="number"
            name="countInStock"
            placeholder="库存数量"
            onChange={handleChange}
          />
          <input
            type="text"
            name="sku"
            placeholder="SKU 编号"
            onChange={handleChange}
          />

          {/* 下拉选择项：分类 */}
          <select
            name="category"
            onChange={handleChange}
            value={formData.category}
          >
            <option value="">选择分类</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* 下拉选择项：品牌 */}
          <select name="brand" onChange={handleChange} value={formData.brand}>
            <option value="">选择品牌</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* 多选项：尺码 */}
          <div>
            <label>尺码选择：</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <label key={size}>
                  <input
                    type="checkbox"
                    value={size}
                    checked={formData.sizes.includes(size)}
                    onChange={() => handleMultiSelect("sizes", size)}
                  />{" "}
                  {size}
                </label>
              ))}
            </div>
          </div>

          {/* 多选项：颜色（使用 colorMap 中英文映射） */}
          <div>
            <label>颜色选择：</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(colorMap).map(([en, zh]) => (
                <label key={en}>
                  <input
                    type="checkbox"
                    value={en}
                    checked={formData.colors.includes(en)}
                    onChange={() => handleMultiSelect("colors", en)}
                  />{" "}
                  {zh}
                </label>
              ))}
            </div>
          </div>

          {/* 下拉选择项：系列 */}
          <select
            name="collections"
            onChange={handleChange}
            value={formData.collections}
          >
            <option value="">选择系列</option>
            {collections.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* 下拉选择项：面料 */}
          <select
            name="material"
            onChange={handleChange}
            value={formData.material}
          >
            <option value="">选择面料</option>
            {materials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* 下拉选择项：性别 */}
          <select name="gender" onChange={handleChange} value={formData.gender}>
            <option value="">选择性别</option>
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* 图片上传区域 */}
          <div>
            <label>上传图片</label>
            <input type="file" onChange={handleImageUpload} />
            <div className="flex gap-2 mt-2 flex-wrap">
              {formData.images.map((img, idx) => (
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
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            添加
          </button>
        </form>
      </div>
    </div>
  );
};

// ✅ 导出组件供页面调用
export default AddProductModal;
