import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch
import { logoutUser } from "../../../redux/actions/userActions"; // Import logout action
import BreadcrumbCom from "../../BreadcrumbCom";
import Layout from "../../Partials/Layout";
import IcoAdress from "./icons/IcoAdress";
import IcoCart from "./icons/IcoCart";
import IcoLogout from "./icons/IcoLogout";
import IcoLove from "./icons/IcoLove";
import IcoPassword from "./icons/IcoPassword";
import IcoPeople from "./icons/IcoPeople";
import IcoReviewHand from "./icons/IcoReviewHand";
import AddressesTab from "./tabs/AddressesTab";
import OrderTab from "./tabs/OrderTab";
import PasswordTab from "./tabs/PasswordTab";
import WishlistTab from "./tabs/WishlistTab";
import ProfileTab from "./tabs/ProfileTab";
import ReviewTab from "./tabs/ReviewTab";

export default function Profile() {
  const [active, setActive] = useState("profile");
  const location = useLocation();
  const getHashContent = location.hash.split("#");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Sử dụng useDispatch từ Redux
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    setActive(
      getHashContent && getHashContent.length > 1
        ? getHashContent[1]
        : "profile"
    );
  }, [getHashContent]);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xóa token và thông tin user từ Redux
    localStorage.removeItem("token");
    dispatch(logoutUser());

    // Điều hướng về trang đăng nhập
    navigate("/login");
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="profile-page-wrapper w-full">
        <div className="container-x mx-auto">
          <div className="w-full my-10">
            <BreadcrumbCom
              paths={[
                { name: "Trang chủ", path: "/" },
                { name: "Trang cá nhân", path: "/profile" },
              ]}
            />
            <div className="w-full bg-white px-10 py-9">
              <div className="title-area w-full flex justify-between items-center">
                <h1 className="text-[22px] font-bold text-qblack">
                  Trang cá nhân
                </h1>
              </div>
              <div className="profile-wrapper w-full mt-8 flex space-x-10">
                <div className="w-[236px] min-h-[600px] border-r border-[rgba(0, 0, 0, 0.1)]">
                  <div className="flex flex-col space-y-10">
                    <div className="item group">
                      <Link to="/profile#profile">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoPeople />
                          </span>
                          <span className="font-normal text-base">
                            Thông tin cá nhân
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className="item group">
                      <Link to="/profile#order">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoCart />
                          </span>
                          <span className="font-normal text-base">
                            Đơn hàng
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className="item group">
                      <Link to="/profile#wishlist">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoLove />
                          </span>
                          <span className="font-normal text-base">
                            Danh sách yêu thích
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className="item group">
                      <Link to="/profile#address">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoAdress />
                          </span>
                          <span className="font-normal text-base">Địa chỉ</span>
                        </div>
                      </Link>
                    </div>

                    {/* <div className="item group">
                      <Link to="/profile#review">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoReviewHand />
                          </span>
                          <span className="font-normal text-base">
                            Đánh giá
                          </span>
                        </div>
                      </Link>
                    </div> */}

                    <div className="item group">
                      <Link to="/profile#password">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoPassword />
                          </span>
                          <span className="font-normal text-base">
                            Thay đổi mật khẩu
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className="item group">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left"
                      >
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoLogout />
                          </span>
                          <span className="font-normal text-base">
                            Đăng xuất
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="item-body dashboard-wrapper w-full">
                    {active === "dashboard" ? (
                      <Dashboard />
                    ) : active === "profile" ? (
                      <ProfileTab />
                    ) : active === "order" ? (
                      <OrderTab />
                    ) : active === "wishlist" ? (
                      <WishlistTab />
                    ) : active === "address" ? (
                      <AddressesTab />
                    ) : active === "password" ? (
                      <PasswordTab />
                    ) : active === "review" ? (
                      <ReviewTab />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
