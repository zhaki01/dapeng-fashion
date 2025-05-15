// FeaturesSection.jsx
// ✅ 首页功能亮点展示组件
// 此组件用于展示平台的三大核心服务优势：全球包邮、无忧退货、安全支付。
// 每项服务以图标 + 标题 + 描述的形式呈现，增强用户信任感。

import {
  HiArrowPathRoundedSquare, // 图标：退货箭头
  HiOutlineCreditCard, // 图标：信用卡
  HiShoppingBag, // 图标：购物袋
} from "react-icons/hi2"; // 引入 heroicons 图标库中的图标组件

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-[#F9FAF9]">
      {/* ✅ 网格布局：单列或三列（响应式） */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* ✅ 特色 1：全球包邮服务 */}
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          {/* 图标圆形背景容器 */}
          <div className="p-4 rounded-full bg-[#E6F1EC] text-[#1F7D53] mb-4">
            <HiShoppingBag className="text-3xl" />
          </div>
          {/* 标题 */}
          <h4 className="text-lg font-semibold text-[#18230F] mb-2">
            全球包邮服务
          </h4>
          {/* 描述文本 */}
          <p className="text-gray-600 text-sm">
            所有满￥699的订单均可享受免费配送
          </p>
        </div>

        {/* ✅ 特色 2：无忧退货服务 */}
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          {/* 图标 */}
          <div className="p-4 rounded-full bg-[#E6F1EC] text-[#1F7D53] mb-4">
            <HiArrowPathRoundedSquare className="text-3xl" />
          </div>
          <h4 className="text-lg font-semibold text-[#18230F] mb-2">
            45天无忧退货
          </h4>
          <p className="text-gray-600 text-sm">支持全额退款保障，购物无压力</p>
        </div>

        {/* ✅ 特色 3：安全支付服务 */}
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          {/* 图标 */}
          <div className="p-4 rounded-full bg-[#E6F1EC] text-[#1F7D53] mb-4">
            <HiOutlineCreditCard className="text-3xl" />
          </div>
          <h4 className="text-lg font-semibold text-[#18230F] mb-2">
            安全加密支付
          </h4>
          <p className="text-gray-600 text-sm">100% 安全保障的支付流程</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; // ✅ 导出组件，供首页调用
