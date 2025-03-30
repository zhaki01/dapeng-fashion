// Footer.jsx
// Footer.jsx
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-12 bg-[#F8F9F8]">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10 px-4 lg:px-0">
        {/* Newsletter */}
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

        {/* Shop Links */}
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

        {/* Support Links */}
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

        {/* Follow Us */}
        <div>
          <h3 className="text-lg font-semibold text-[#1F7D53] mb-4">
            关注我们
          </h3>
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
          <p className="text-gray-600 text-sm mb-1">客服热线</p>
          <p className="text-[#27391C] text-sm">
            <FiPhoneCall className="inline-block mr-2" />
            0123-456-789
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tight text-center">
          © 2025 鹏衣有道 | 版权所有
        </p>
      </div>
    </footer>
  );
};

export default Footer;
