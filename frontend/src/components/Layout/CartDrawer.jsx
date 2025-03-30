//  CartDrawer.jsx
//  CartDrawer;
import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-xl transform transition-transform duration-300 flex flex-col z-50 rounded-l-2xl ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Close Button  */}
      <div className="flex justify-end p-4 border-b border-gray-200">
        <button
          onClick={toggleCartDrawer}
          className="hover:bg-gray-100 p-2 rounded-lg"
        >
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Cart contents with scrollable area  */}
      <div className="flex-grow px-6 pt-4 pb-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#1F7D53] mb-4 tracking-tight">
          我的购物车
        </h2>
        {cart && cart?.products?.length > 0 ? (
          <CartContents cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p className="text-gray-500">您的购物车为空。</p>
        )}
      </div>

      {/* Checkout button fixed at the bottom */}
      <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
        {cart && cart?.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#1F7D53] text-white py-3 rounded-lg font-semibold hover:bg-[#255F38] transition"
            >
              前往结算
            </button>
            <p className="text-xs tracking-tight text-gray-500 mt-2 text-center">
              运费、税费和优惠将在结算时计算
            </p>
          </>
        )}
      </div>
    </div>
  );
};
export default CartDrawer;
