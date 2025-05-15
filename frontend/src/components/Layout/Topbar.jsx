// Topbar.jsx
// ✅ 顶部导航栏组件（Topbar）
// 本组件用于显示网站顶部的简要信息区域，包含客服电话、宣传语和社交图标。
// 在移动端隐藏部分信息，在桌面端完整展示，提升用户体验。

// 引入社交图标组件
import { RiWechatLine, RiWeiboLine } from "react-icons/ri"; // 微信、微博图标
import { SiBilibili } from "react-icons/si"; // 哔哩哔哩图标

const Topbar = () => {
  return (
    // 背景为主题红色，字体为白色
    <div className="bg-rabbit-red text-white">
      {/* ✅ 内容容器：设置左右间距和垂直居中布局 */}
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* ✅ 左侧：客服电话，仅在中等屏幕以上显示 */}
        <div className="text-sm hidden md:block">
          <a href="tel:+1234567890" className="hover:text-gray-300">
            +86 1234567890
          </a>
        </div>

        {/* ✅ 中间：宣传语，始终居中显示 */}
        <div className="text-sm text-center flex-grow">
          <span> 多条件筛选 · 智能搭配 · 极速推荐 </span>
        </div>

        {/* ✅ 右侧：社交媒体图标，仅在中等屏幕以上显示 */}
        <div className="hidden md:flex items-center space-x-4">
          {/* 微信图标 */}
          <a href="#" className="hover:text-gray-300" title="微信">
            <RiWechatLine className="h-5 w-5" />
          </a>
          {/* 微博图标 */}
          <a href="#" className="hover:text-gray-300" title="微博">
            <RiWeiboLine className="h-5 w-5" />
          </a>
          {/* 哔哩哔哩图标 */}
          <a href="#" className="hover:text-gray-300" title="哔哩哔哩">
            <SiBilibili className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

// ✅ 导出组件
export default Topbar;
