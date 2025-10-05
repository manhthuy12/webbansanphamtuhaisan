import { useEffect } from "react";
import { useSelector } from "react-redux"; // Import useSelector từ react-redux
import { Link, useNavigate } from "react-router-dom";
import ThinBag from "../../../Helpers/icons/ThinBag";
import ThinLove from "../../../Helpers/icons/ThinLove";
import ThinPeople from "../../../Helpers/icons/ThinPeople";
import SearchBox from "../../../Helpers/SearchBox";
import Cart from "../../../Cart";
import Compair from "../../../Helpers/icons/Compair";

export default function Middlebar({ className, type }) {
  const navigate = useNavigate();

  // Lấy thông tin user từ Redux
  const user = useSelector((state) => state.user.userInfo);

  // Lấy số lượng từ cart, wishlist và compare từ Redux
  const cartCount = useSelector((state) => state.cart.cart.length);
  const wishlistCount = useSelector((state) => state.wishlist.wishlist.length);
  const compareCount = useSelector((state) => state.compare.compare.length);

  useEffect(() => {
    // Nếu cần thiết, bạn có thể thực hiện logic gì đó khi user thay đổi
  }, [user]);

  const handleProfileClick = () => {
    if (user) {
      // Nếu có user, điều hướng đến trang profile
      navigate("/profile");
    } else {
      // Nếu không có user, điều hướng đến trang đăng nhập
      navigate("/login");
    }
  };

  return (
    <div className={`w-full h-[86px] bg-white ${className}`}>
      <div className="container-x mx-auto h-full">
        <div className="relative h-full">
          <div className="flex justify-between items-center h-full">
            <div>
              <Link to="/">
                <h1 className="text-2xl font-bold text-gray-900">
                  Nước Mắm Hùng An
                </h1>
              </Link>
            </div>
            <div className="w-[517px] h-[44px]">
              <SearchBox type={type} className="search-com" />
            </div>
            <div className="flex space-x-6 items-center">
              {/* Compare Section */}
              <div className="compaire relative">
                <Link to="/products-compaire">
                  <span>
                    <Compair />
                  </span>
                </Link>
                <span
                  className={`w-[18px] h-[18px] rounded-full absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px] ${
                    type === 3 ? "bg-qh3-blue text-white" : "bg-qyellow"
                  }`}
                >
                  {compareCount}
                </span>
              </div>

              {/* Wishlist Section */}
              <div className="favorite relative">
                <Link to="/wishlist">
                  <span>
                    <ThinLove />
                  </span>
                </Link>
                <span
                  className={`w-[18px] h-[18px] rounded-full absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px] ${
                    type === 3 ? "bg-qh3-blue text-white" : "bg-qyellow"
                  }`}
                >
                  {wishlistCount}
                </span>
              </div>

              {/* Cart Section */}
              <div className="cart-wrapper group relative py-4">
                <div className="cart relative cursor-pointer">
                  <Link to="/cart">
                    <span>
                      <ThinBag />
                    </span>
                  </Link>
                  <span
                    className={`w-[18px] h-[18px] rounded-full absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px] ${
                      type === 3 ? "bg-qh3-blue text-white" : "bg-qyellow"
                    }`}
                  >
                    {cartCount}
                  </span>
                </div>
                <Cart
                  type={type}
                  className="absolute -right-[45px] top-11 z-50 hidden group-hover:block"
                />
              </div>

              {/* User Profile Section */}
              <div onClick={handleProfileClick} className="cursor-pointer">
                {user && user.profile && user.profile.avatar ? (
                  <img
                    src={user.profile.avatar}
                    alt={user.profile.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <ThinPeople />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
