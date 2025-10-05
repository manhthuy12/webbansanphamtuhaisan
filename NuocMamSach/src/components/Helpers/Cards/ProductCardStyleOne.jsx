import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Compair from "../icons/Compair";
import QuickViewIco from "../icons/QuickViewIco";
import Star from "../icons/Star";
import ThinLove from "../icons/ThinLove";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { formatCurrency } from "../../../utils/formatCurrency";
import ProductModal from "../../../components/SingleProductPage/ProductModal";
import {
  AddToCart,
  MakeIsInCartTrue,
} from "../../../redux/actions/cartActions";
import {
  AddToWishlist,
  MakeIsInWishlistTrueInWishlist,
} from "../../../redux/actions/wishlistActions";
import {
  AddToCompare,
  MakeIsInCompareTrueInCompare,
} from "../../../redux/actions/compareActions";
import { message } from "antd";

export default function ProductCardStyleOne({ datas, type }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const dispatch = useDispatch();

  const openModal = () => {
    setSelectedProduct(datas);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    dispatch(AddToCart(datas));
    dispatch(MakeIsInCartTrue(datas.id));
    message.success(`"${datas.name}" đã thêm vào giỏ hàng`);
  };

  const handleAddToWishlist = () => {
    dispatch(AddToWishlist(datas));
    dispatch(MakeIsInWishlistTrueInWishlist(datas.id));
    message.success(`"${datas.name}" đã thêm vào danh sách yêu thích`);
  };

  const handleAddToCompare = () => {
    dispatch(AddToCompare(datas));
    dispatch(MakeIsInCompareTrueInCompare(datas.id));
    message.success(`"${datas.name}" đã thêm vào danh sách so sánh`);
  };

  return (
    <div
      className="product-card-one w-full h-full bg-white relative group overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl"
      style={{ boxShadow: "0px 15px 64px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {/* Product Image */}
      <div
        className="product-card-img w-full h-[280px] bg-gray-200"
        style={{
          background: `url(${datas?.images[0]}) no-repeat center`,
          backgroundSize: "cover",
        }}
      >
        {(datas.hot || datas.sale) && (
          <div className="product-type absolute right-[14px] top-[17px]">
            <span
              className={`text-[9px] font-bold py-[6px] px-3 uppercase text-white rounded-full tracking-wider ${datas.hot ? "bg-red-500" : "bg-green-500"
                }`}
            >
              {datas.hot ? "Nổi bật" : "Khuyến mãi"}
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="product-card-details px-[20px] py-[20px] relative">
        {/* Add to Cart or View Details Button */}
        {datas.variants && datas.variants.length > 0 ? (
          <Link to={`/single-product/${datas.id}`}>
            <button
              type="button"
              className={`w-full py-2 rounded-md font-semibold flex items-center justify-center space-x-2 ${type === 3
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-yellow-500 hover:bg-yellow-600"
                } transition-all duration-300 ease-in-out`}
            >
              <span className="text-black">Xem chi tiết</span>
            </button>
          </Link>
        ) : (
          <button
            type="button"
            className={`w-full py-2 rounded-md font-semibold flex items-center justify-center space-x-2 ${type === 3
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-yellow-500 hover:bg-yellow-600"
              } transition-all duration-300 ease-in-out`}
            onClick={handleAddToCart}
          >
            <ShoppingCartOutlined className="mr-2 text-black" />
            <span className="text-black">Thêm vào giỏ hàng</span>
          </button>
        )}

        {/* Product Rating */}
        <div className="reviews flex space-x-[2px] mb-3 mt-2">
          {Array.from(Array(datas.averageRating), (_, index) => (
            <span key={index}>
              <Star />
            </span>
          ))}
        </div>

        {/* Product Title */}
        <Link to={`/single-product/${datas.id}`}>
          <p className="title mb-2 text-[14px] font-semibold text-gray-800 leading-5 line-clamp-2 hover:text-blue-600">
            {datas.name}
          </p>
        </Link>

        {/* Product Price */}
        <div className="price">
          {datas.salePrice < datas.price ? (
            <>
              <span className="main-price text-gray-400 line-through text-sm">
                {formatCurrency(datas.price)}
              </span>
              <span className="offer-price text-red-500 text-base ml-2">
                {formatCurrency(datas.salePrice)}
              </span>
            </>
          ) : (
            <span className="main-price text-black text-base">
              {formatCurrency(datas.price)}
            </span>
          )}
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className="quick-access-btns flex flex-col space-y-2 absolute group-hover:right-4 -right-10 top-16 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
        {/* Quick View */}
        <a href="#!" onClick={openModal}>
          <span className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full">
            <QuickViewIco />
          </span>
        </a>
        {/* Add to Wishlist */}
        <a href="#!" onClick={handleAddToWishlist}>
          <span className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200">
            <ThinLove />
          </span>
        </a>
        {/* Add to Compare */}
        <a href="#!" onClick={handleAddToCompare}>
          <span className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200">
            <Compair />
          </span>
        </a>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
}
