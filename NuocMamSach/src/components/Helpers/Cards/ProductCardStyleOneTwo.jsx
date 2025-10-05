import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined, StarFilled } from "@ant-design/icons"; // Shopping cart icon from Ant Design
import Compair from "../icons/Compair";
import QuickViewIco from "../icons/QuickViewIco";
import ThinLove from "../icons/ThinLove";
import ProductModal from "../../SingleProductPage/ProductModal";
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
import { formatCurrency } from "../../../utils/formatCurrency";

export default function ProductCardStyleOneTwo({ datas }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const wishlistState = useSelector((state) => state.wishlist);
  const compareState = useSelector((state) => state.compare);

  const cart = cartState.cart;
  const wishlist = wishlistState.wishlist;
  const compare = compareState.compare;

  const openModal = () => {
    setSelectedProduct(datas);
    setModalOpen(true);
  };
  const isInCart = cart.some((product) => product.id === datas.id);
  const isInWishlist = wishlist.some((product) => product.id === datas.id);
  const isInCompare = compare.some((product) => product.id === datas.id);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    dispatch(AddToCart(datas));
    dispatch(MakeIsInCartTrue(datas.id));
    message.success(`"${datas.name}" đã được thêm vào giỏ hàng.`);
  };

  const handleAddToWishlist = () => {
    dispatch(AddToWishlist(datas));
    dispatch(MakeIsInWishlistTrueInWishlist(datas.id));
    message.success(`"${datas.name}" đã được thêm vào danh sách yêu thích.`);
  };

  const handleAddToCompare = () => {
    dispatch(AddToCompare(datas));
    dispatch(MakeIsInCompareTrueInCompare(datas.id));
    message.success(`"${datas.name}" đã được thêm vào danh sách so sánh.`);
  };

  return (
    <>
      <div
        className="product-card-style-one-two w-full h-full bg-white relative group overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
        style={{ boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.1)" }}
      >
        {/* Sale Badge */}
        {datas.sale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">
            SALE
          </div>
        )}

        {/* Product Image */}
        <div
          className="product-card-img w-full h-[280px] bg-gray-200 mt-4 rounded-t-lg"
          style={{
            background: `url(${datas?.images[0]}) no-repeat center`,
            backgroundSize: "cover",
          }}
        ></div>

        {/* Product Details */}
        <div className="product-card-details flex flex-col items-center py-3 px-3">
          {/* Product Title */}
          <Link to={`/single-product/${datas?.id}`}>
            <p className="title mb-1 text-base font-medium text-center text-gray-800 leading-5 line-clamp-2 hover:text-blue-600">
              {datas?.name}
            </p>
          </Link>

          {/* Price Section */}
          <div className="flex justify-center items-center space-x-1">
            {datas?.salePrice < datas.price ? (
              <>
                <span className="offer-price text-red-500 font-semibold text-base">
                  {formatCurrency(datas?.salePrice)}
                </span>
                <span className="main-price text-gray-500 line-through text-sm">
                  {formatCurrency(datas?.price)}
                </span>
              </>
            ) : (
              <span className="main-price text-black-600 font-semibold text-base">
                {formatCurrency(datas?.price)}
              </span>
            )}
          </div>

          {/* Rating Section */}
          <div className="flex items-center space-x-1 mt-2">
            {Array.from({ length: 5 }, (_, index) => (
              <StarFilled
                key={index}
                className={`text-yellow-400 ${index < datas.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
              />
            ))}
            <span className="ml-2 text-xs text-gray-500">
              ({datas.reviews.length} Đánh giá)
            </span>
          </div>
        </div>

        {/* Add to Cart Button (Hover) */}
        <div className="absolute w-[204px] h-[54px] left-[50%] transform -translate-x-[50%] -bottom-20 group-hover:bottom-5 transition-all duration-300 ease-in-out">
          {datas.variants && datas.variants.length > 0 ? (
            <Link to={`/single-product/${datas.id}`}>
              <button
                type="button"
                className={`w-full py-2 rounded-md font-semibold flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 ease-in-out`}
              >
                <span className="text-black">Xem chi tiết</span>
              </button>
            </Link>
          ) : (
            <button
              type="button"
              className={`w-full py-2 rounded-md font-semibold flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 ease-in-out`}
              onClick={handleAddToCart}
            >
              <ShoppingCartOutlined className="mr-2 text-black" />
              <span className="text-black">Thêm vào giỏ hàng</span>
            </button>
          )}
        </div>

        {/* Quick Actions (Hover Buttons) */}
        <div className="quick-access-btns flex flex-col space-y-2 absolute right-3 top-16 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
          <a href="#!" onClick={openModal}>
            <span className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full">
              <QuickViewIco />
            </span>
          </a>
          <a
            href="#!"
            onClick={!isInWishlist ? handleAddToWishlist : undefined}
            style={isInWishlist ? { pointerEvents: "none", opacity: 1 } : {}}
          >
            <span
              className={`w-10 h-10 flex justify-center items-center rounded-full ${isInWishlist ? "bg-yellow-500" : "bg-gray-200"
                }`}
            >
              <ThinLove />
            </span>
          </a>
          <a
            href="#!"
            onClick={!isInCompare ? handleAddToCompare : undefined}
            style={isInCompare ? { pointerEvents: "none", opacity: 1 } : {}}
          >
            <span
              className={`w-10 h-10 flex justify-center items-center rounded-full ${isInCompare ? "bg-yellow-500" : "bg-gray-200"
                }`}
            >
              <Compair />
            </span>
          </a>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedProduct={selectedProduct}
        />
      )}
    </>
  );
}
