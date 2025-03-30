//  FeaturesSection.jsx
//  FeaturesSection;
import {
  HiArrowPathRoundedSquare,
  HiOutlineCreditCard,
  HiShoppingBag,
} from "react-icons/hi2";

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-[#F9FAF9]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Feature 1 */}
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          <div className="p-4 rounded-full bg-[#E6F1EC] text-[#1F7D53] mb-4">
            <HiShoppingBag className="text-3xl" />
          </div>
          <h4 className="text-lg font-semibold text-[#18230F] mb-2">
            全球包邮服务
          </h4>
          <p className="text-gray-600 text-sm">
            所有满￥699的订单均可享受免费配送
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          <div className="p-4 rounded-full bg-[#E6F1EC] text-[#1F7D53] mb-4">
            <HiArrowPathRoundedSquare className="text-3xl" />
          </div>
          <h4 className="text-lg font-semibold text-[#18230F] mb-2">
            45天无忧退货
          </h4>
          <p className="text-gray-600 text-sm">支持全额退款保障，购物无压力</p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
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

export default FeaturesSection;
