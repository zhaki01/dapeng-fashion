// Topbar.jsx
// import { TbBrandMeta } from "react-icons/tb";
// import { IoLogoInstagram } from "react-icons/io";
// import { RiTwitterXLine } from "react-icons/ri";
import { RiWechatLine, RiWeiboLine } from "react-icons/ri";
import { SiBilibili } from "react-icons/si";
const Topbar = () => {
  return (
    <div className="bg-rabbit-red text-white">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <div className="text-sm hidden md:block">
          <a href="tel:+1234567890" className="hover:text-gray-300">
            +86 1234567890
          </a>
        </div>
        <div className="text-sm text-center flex-grow">
          <span> 多条件筛选 · 智能搭配 · 极速推荐 </span>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-300" title="微信">
            <RiWechatLine className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300" title="微博">
            <RiWeiboLine className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300" title="哔哩哔哩">
            <SiBilibili className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
};
export default Topbar;
