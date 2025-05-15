// ProductManagement.jsx
// 📁 后台商品管理组件
// 说明：该页面用于管理员查看、添加、编辑、删除商品信息。
// 使用 Redux 获取商品数据，支持通过弹窗添加商品，通过按钮操作编辑/删除。

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { Link } from "react-router-dom"; // 路由跳转组件

// ✅ 引入商品相关操作：获取、删除
import {
  deleteProduct,
  fetchAdminProducts,
} from "../../redux/slices/adminProductSlice";

// ✅ 引入添加商品的弹窗组件
import AddProductModal from "./AddProductModal";

const ProductManagement = () => {
  const dispatch = useDispatch(); // 初始化 Redux 的 dispatch 函数

  // 从 Redux 中获取商品列表、加载状态和错误信息
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  // 控制是否显示“添加商品”弹窗
  const [showAddModal, setShowAddModal] = useState(false);

  // ✅ 页面加载时获取所有商品数据
  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  // ✅ 删除商品处理函数
  const handleDelete = (id) => {
    // 弹窗确认后才进行删除
    if (window.confirm("确定要删除该商品吗？")) {
      dispatch(deleteProduct(id));
    }
  };

  // ✅ 页面加载状态处理
  if (loading) return <p>加载中...</p>;
  if (error) return <p className="text-red-500">错误: {error}</p>;

  // ✅ 页面主结构
  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      <h2 className="text-3xl font-bold text-[#1F7D53] mb-6">商品管理</h2>

      {/* 添加商品按钮 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          添加商品
        </button>
      </div>

      {/* 商品表格 */}
      <div className="overflow-x-auto shadow-md rounded-xl bg-white">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="py-3 px-4">商品名称</th>
              <th className="py-3 px-4">价格</th>
              <th className="py-3 px-4">SKU 编号</th>
              <th className="py-3 px-4">操作</th>
            </tr>
          </thead>

          <tbody>
            {/* ✅ 有商品时渲染列表 */}
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="p-4">￥{product.price}</td>
                  <td className="p-4">{product.sku}</td>

                  {/* 编辑和删除操作按钮 */}
                  <td className="p-4">
                    {/* 点击跳转到商品编辑页面 */}
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2 transition"
                    >
                      编辑
                    </Link>

                    {/* 点击触发删除 */}
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // ✅ 无商品时显示提示信息
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  暂无商品。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ 添加商品弹窗 */}
      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

// ✅ 导出组件
export default ProductManagement;
