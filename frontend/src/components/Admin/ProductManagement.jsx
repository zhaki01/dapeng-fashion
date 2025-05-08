// ProductManagement.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteProduct,
  fetchAdminProducts,
} from "../../redux/slices/adminProductSlice";
import AddProductModal from "./AddProductModal";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("确定要删除该商品吗？")) {
      dispatch(deleteProduct(id));
    }
  };

  if (loading) return <p>加载中...</p>;
  if (error) return <p className="text-red-500">错误: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      <h2 className="text-3xl font-bold text-[#1F7D53] mb-6">商品管理</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          添加商品
        </button>
      </div>

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
                  <td className="p-4">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2 transition"
                    >
                      编辑
                    </Link>
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
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  暂无商品。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 添加商品弹窗 */}
      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default ProductManagement;
