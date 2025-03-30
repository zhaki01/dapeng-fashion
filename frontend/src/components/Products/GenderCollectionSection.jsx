// 这是一个展示男女系列和上装、下装系列的组件

//  GenderCollectionSection;

import { Link } from "react-router-dom";
import mensCollectionImage from "../../assets/5.png";
import womensCollectionImage from "../../assets/4.png";
import topsImage from "../../assets/2.png"; // 假设你准备了图片
import bottomsImage from "../../assets/6.png"; // 假设你准备了图片

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Women's Collection */}
        <div className="relative group overflow-hidden rounded-2xl shadow-md">
          <img
            src={womensCollectionImage}
            alt="Women's Collection"
            className="w-full h-[500px] object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300"></div>
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 rounded-lg p-5 backdrop-blur-sm shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              → 女士系列
            </h2>
            <Link
              to="/collections/all?gender=女士"
              className="text-sm font-medium text-gray-800 underline hover:text-black transition"
            >
              立即购买
            </Link>
          </div>
        </div>

        {/* Men's Collection */}
        <div className="relative group overflow-hidden rounded-2xl shadow-md">
          <img
            src={mensCollectionImage}
            alt="Men's Collection"
            className="w-full h-[500px] object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300"></div>
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 rounded-lg p-5 backdrop-blur-sm shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              → 男士系列
            </h2>
            <Link
              to="/collections/all?gender=男士"
              className="text-sm font-medium text-gray-800 underline hover:text-black transition"
            >
              立即购买
            </Link>
          </div>
        </div>

        {/* Tops Collection */}
        <div className="relative group overflow-hidden rounded-2xl shadow-md">
          <img
            src={topsImage}
            alt="Tops Collection"
            className="w-full h-[500px] object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300"></div>
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 rounded-lg p-5 backdrop-blur-sm shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              → 上装系列
            </h2>
            <Link
              to="/collections/all?category=上装"
              className="text-sm font-medium text-gray-800 underline hover:text-black transition"
            >
              立即购买
            </Link>
          </div>
        </div>

        {/* Bottoms Collection */}
        <div className="relative group overflow-hidden rounded-2xl shadow-md">
          <img
            src={bottomsImage}
            alt="Bottoms Collection"
            className="w-full h-[500px] object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300"></div>
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 rounded-lg p-5 backdrop-blur-sm shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              → 下装系列
            </h2>
            <Link
              to="/collections/all?category=下装"
              className="text-sm font-medium text-gray-800 underline hover:text-black transition"
            >
              立即购买
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
