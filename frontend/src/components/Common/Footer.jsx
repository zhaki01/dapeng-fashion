// Footer.jsx
// 📄 页脚组件
// 该组件用于电商网站底部显示，包含：订阅模块、分类导航、支持信息、社交媒体链接及版权信息。
// 使用了 React Icons 图标库 和 React Router 的 Link 组件进行导航跳转。

import { IoLogoInstagram } from "react-icons/io"; // Instagram 图标
import { RiTwitterXLine } from "react-icons/ri"; // Twitter(X) 图标
import { TbBrandMeta } from "react-icons/tb"; // Meta(Facebook) 图标
import { FiPhoneCall } from "react-icons/fi"; // 电话图标
import { Link } from "react-router-dom"; // 用于内部跳转的链接组件

const Footer = () => {
  return (
    <footer className="border-t py-12 bg-[#F8F9F8]">
      {/* ✅ 页脚内容主区域（4 列布局） */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10 px-4 lg:px-0">
        {/* ✅ 订阅区域 */}
        <div>
          <h3 className="text-lg font-semibold text-[#1F7D53] mb-4">
            订阅资讯
          </h3>
          <p className="text-gray-600 mb-3 text-sm">
            及时获取新品资讯、专属活动与限时优惠。
          </p>
          <p className="text-sm text-[#27391C] mb-6">
            订阅即享首单<span className="font-semibold">9折优惠</span>
          </p>

          {/* 📧 邮箱输入与订阅按钮 */}
          <form className="flex">
            <input
              type="email"
              placeholder="请输入您的邮箱"
              className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#255F38] transition-all"
              required
            />
            <button
              type="submit"
              className="bg-[#1F7D53] text-white px-6 py-3 text-sm rounded-r-md hover:bg-[#255F38] transition-all"
            >
              订阅
            </button>
          </form>
        </div>

        {/* ✅ 商品分类导航 */}
        <div>
          <h3 className="text-lg font-semibold text-[#1F7D53] mb-4">
            选购分类
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link
                to="/collections/all?gender=男士&category=上装"
                className="hover:text-[#255F38]"
              >
                男士上装
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all?gender=女士&category=上装"
                className="hover:text-[#255F38]"
              >
                女士上装
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all?gender=男士&category=下装"
                className="hover:text-[#255F38]"
              >
                男士下装
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all?gender=女士&category=下装"
                className="hover:text-[#255F38]"
              >
                女士下装
              </Link>
            </li>
          </ul>
        </div>

        {/* ✅ 帮助与支持导航 */}
        <div>
          <h3 className="text-lg font-semibold text-[#1F7D53] mb-4">
            帮助支持
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link to="#" className="hover:text-[#255F38]">
                联系我们
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#255F38]">
                关于我们
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#255F38]">
                常见问题
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#255F38]">
                功能介绍
              </Link>
            </li>
          </ul>
        </div>

        {/* ✅ 社交媒体 & 客服联系方式 */}
        <div>
          <h3 className="text-lg font-semibold text-[#1F7D53] mb-4">
            关注我们
          </h3>

          {/* 社交图标链接 */}
          <div className="flex items-center space-x-4 mb-4">
            <a
              href="#"
              className="hover:text-[#255F38]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="hover:text-[#255F38]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="hover:text-[#255F38]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiTwitterXLine className="h-4 w-4" />
            </a>
          </div>

          {/* 客服热线 */}
          <p className="text-gray-600 text-sm mb-1">客服热线</p>
          <p className="text-[#27391C] text-sm">
            <FiPhoneCall className="inline-block mr-2" />
            0123-456-789
          </p>
        </div>
      </div>

      {/* ✅ 页脚底部版权信息 */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tight text-center">
          © 2025 鹏衣有道 | 版权所有
        </p>
      </div>
    </footer>
  );
};

// ✅ 导出 Footer 组件
export default Footer;
