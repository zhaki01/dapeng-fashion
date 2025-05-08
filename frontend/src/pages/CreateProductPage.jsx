import { useState } from "react";
import axiosInstance from "@/utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
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
    rating: 0,
    numReviews: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axiosInstance.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
    } catch (err) {
      console.error("图片上传失败", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/admin/products", productData);
      navigate("/admin/products");
    } catch (error) {
      console.error("添加失败", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">添加新商品</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
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
          placeholder="SKU"
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="分类"
          onChange={handleChange}
        />
        <input
          type="text"
          name="brand"
          placeholder="品牌"
          onChange={handleChange}
        />
        <input
          type="text"
          name="sizes"
          placeholder="尺码（用逗号分隔）"
          onChange={(e) =>
            setProductData({ ...productData, sizes: e.target.value.split(",") })
          }
        />
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
        <input
          type="text"
          name="collections"
          placeholder="系列"
          onChange={handleChange}
        />
        <input
          type="text"
          name="material"
          placeholder="面料"
          onChange={handleChange}
        />
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

export default CreateProductPage;
