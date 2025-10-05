import { useSelector, useDispatch } from "react-redux";
import BreadcrumbCom from "../BreadcrumbCom";
import EmptyWishlistError from "../EmptyWishlistError";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import ProductsTable from "./ProductsTable";
import { clearWishlist } from "../../redux/actions/wishlistActions";
import { message } from "antd";
import { useEffect } from "react";

export default function Wishlist() {
  // Lấy wishlist từ Redux store
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Hàm xử lý xóa toàn bộ danh sách yêu thích
  const handleClearWishlist = () => {
    message.warning("Đã xóa toàn bộ sản phẩm khỏi danh sách yêu thích");
    dispatch(clearWishlist());
  };
  return (
    <Layout childrenClasses={wishlist.length > 0 ? "pt-0 pb-0" : ""}>
      {wishlist.length <= 0 ? (
        <div className="wishlist-page-wrapper w-full">
          <div className="container-x mx-auto">
            <BreadcrumbCom
              paths={[
                { name: "Trang chủ", path: "/" },
                { name: "Danh sách yêu thích", path: "/wishlist" },
              ]}
            />
            <EmptyWishlistError />
          </div>
        </div>
      ) : (
        <div className="wishlist-page-wrapper w-full bg-white pb-[60px]">
          <div className="w-full">
            <PageTitle
              title="Danh sách yêu thích"
              breadcrumb={[
                { name: "Trang chủ", path: "/" },
                { name: "Danh sách yêu thích", path: "/wishlist" },
              ]}
            />
          </div>
          <div className="w-full mt-[23px]">
            <div className="container-x mx-auto">
              <ProductsTable className="mb-[30px]" />
              <div className="w-full mt-[30px] flex sm:justify-end justify-start">
                <div className="w-[240px] h-[50px]">
                  <button
                    type="button"
                    className="yellow-btn"
                    onClick={handleClearWishlist}
                  >
                    <div className="w-full text-sm font-semibold mb-5 sm:mb-0">
                      Xóa toàn bộ danh sách yêu thích
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
