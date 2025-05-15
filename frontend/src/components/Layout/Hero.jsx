// Hero.jsx
// ✅ 首页横幅组件（Hero Banner）
// 本组件展示网站首页顶部的大图和欢迎文字，常用于电商首页的视觉焦点区域。
// 包含背景图片、主标题、副标题和“现在购物”按钮。

import { Link } from "react-router-dom"; // 用于页面跳转
import heroImg from "../../assets/banner.png"; // 引入横幅图片

const Hero = () => {
  return (
    <section className="relative">
      {/* ✅ 背景图片，全宽展示，设置不同设备高度 */}
      <img
        src={heroImg}
        alt="Rabbit"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
      />

      {/* ✅ 覆盖层：在图片上加一层半透明黑色背景，并居中显示文字内容 */}
      <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center">
        <div className="text-center text-white p-6">
          {/* ✅ 主标题（大字标题） */}
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
            穿搭推荐，有道可循
          </h1>

          {/* ✅ 副标题（简短说明） */}
          <p className="text-sm tracking-tighter md:text-lg mb-6">
            基于你的喜好与筛选，推荐你的专属穿搭风格
          </p>

          {/* ✅ CTA 按钮：点击跳转到商品列表页 */}
          <Link
            to="/collections/all"
            className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg"
          >
            现在购物🛒
          </Link>
        </div>
      </div>
    </section>
  );
};

// ✅ 导出组件
export default Hero;
