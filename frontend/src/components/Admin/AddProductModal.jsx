// AddProductModal.jsx
// 用于商品管理页面中的“添加商品”弹窗表单
import { useState } from "react";
import axiosInstance from "@/utils/axiosConfig";

// const AddProductModal = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: 0,
//     discountPrice: 0,
//     countInStock: 0,
//     sku: "",
//     category: "",
//     brand: "",
//     sizes: [],
//     colors: [],
//     collections: "",
//     material: "",
//     gender: "",
//     images: [],
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     const formDataData = new FormData();
//     formDataData.append("image", file);

//     try {
//       const { data } = await axiosInstance.post("/api/upload", formDataData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setFormData((prev) => ({
//         ...prev,
//         images: [...prev.images, { url: data.imageUrl, altText: "" }],
//       }));
//     } catch (error) {
//       console.error("图片上传失败", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axiosInstance.post("/api/admin/products", {
//         ...formData,
//         sizes: formData.sizes.map((s) => s.trim()),
//         colors: formData.colors.map((c) => c.trim()),
//       });
//       alert("商品添加成功！");
//       onClose();
//       window.location.reload();
//     } catch (error) {
//       console.error("添加失败", error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
//       <div className="bg-white rounded-lg p-6 w-[90%] max-w-3xl shadow-lg relative overflow-y-auto max-h-[90vh]">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-500 hover:text-black"
//         >
//           ✕
//         </button>

//         <h2 className="text-2xl font-bold mb-4">添加新商品</h2>

//         <form onSubmit={handleSubmit} className="grid gap-3">
//           <input
//             type="text"
//             name="name"
//             placeholder="商品名称"
//             onChange={handleChange}
//             required
//           />
//           <textarea
//             name="description"
//             placeholder="商品描述"
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="number"
//             name="price"
//             placeholder="价格"
//             onChange={handleChange}
//           />
//           <input
//             type="number"
//             name="discountPrice"
//             placeholder="折扣价"
//             onChange={handleChange}
//           />
//           <input
//             type="number"
//             name="countInStock"
//             placeholder="库存数量"
//             onChange={handleChange}
//           />
//           <input
//             type="text"
//             name="sku"
//             placeholder="SKU 编号"
//             onChange={handleChange}
//           />
//           <input
//             type="text"
//             name="category"
//             placeholder="分类"
//             onChange={handleChange}
//           />
//           <input
//             type="text"
//             name="brand"
//             placeholder="品牌"
//             onChange={handleChange}
//           />
//           <input
//             type="text"
//             name="sizes"
//             placeholder="尺码（用逗号分隔）"
//             onChange={(e) =>
//               setFormData({ ...formData, sizes: e.target.value.split(",") })
//             }
//           />
//           <input
//             type="text"
//             name="colors"
//             placeholder="颜色（用逗号分隔）"
//             onChange={(e) =>
//               setFormData({ ...formData, colors: e.target.value.split(",") })
//             }
//           />
//           <input
//             type="text"
//             name="collections"
//             placeholder="系列"
//             onChange={handleChange}
//           />
//           <input
//             type="text"
//             name="material"
//             placeholder="面料"
//             onChange={handleChange}
//           />
//           <select name="gender" onChange={handleChange}>
//             <option value="">选择性别</option>
//             <option value="男士">男士</option>
//             <option value="女士">女士</option>
//             <option value="男女通用">男女通用</option>
//           </select>
//           <div>
//             <label className="block mb-1">上传图片</label>
//             <input type="file" onChange={handleImageUpload} />
//             <div className="flex gap-2 mt-2 flex-wrap">
//               {formData.images.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img.url}
//                   alt="预览"
//                   className="w-20 h-20 object-cover rounded"
//                 />
//               ))}
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
//           >
//             添加
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProductModal;
// AddProductModal.jsx
// 添加商品的弹窗表单（增强版，支持选择框）
// import { useState } from "react";
// import axiosInstance from "@/utils/axiosConfig";
import {
  categories,
  brands,
  sizes,
  colors,
  collections,
  materials,
  genders,
} from "@/constants/formOptions"; // 🔧 你需要创建这个文件
import { colorMap } from "@/constants/colorOptions";

const AddProductModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((v) => v !== value)
        : [...prev[name], value],
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formDataData = new FormData();
    formDataData.append("image", file);

    try {
      const { data } = await axiosInstance.post("/api/upload", formDataData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
    } catch (error) {
      console.error("图片上传失败", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/admin/products", formData);
      alert("商品添加成功！");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("添加失败", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-3xl shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">添加新商品</h2>

        <form onSubmit={handleSubmit} className="grid gap-3">
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

          <select name="brand" onChange={handleChange} value={formData.brand}>
            <option value="">选择品牌</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

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

          {/* <div>
            <label>颜色选择：</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <label key={color}>
                  <input
                    type="checkbox"
                    value={color}
                    checked={formData.colors.includes(color)}
                    onChange={() => handleMultiSelect("colors", color)}
                  />{" "}
                  {color}
                </label>
              ))}
            </div>
          </div> */}

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

          <select name="gender" onChange={handleChange} value={formData.gender}>
            <option value="">选择性别</option>
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

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

export default AddProductModal;
