import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { StarFilled, ShoppingCartOutlined } from "@ant-design/icons";
import Compair from "../icons/Compair";
import QuickViewIco from "../icons/QuickViewIco";
import ThinLove from "../icons/ThinLove";
import ProductModal from "../../SingleProductPage/ProductModal"; // Import ProductModal
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
import { message } from "antd"; // Import message for notifications

export default function ProductCardRowStyleOneTwo({ className, datas }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const dispatch = useDispatch();

  const cartState = useSelector((state) => state.cart);
  const wishlistState = useSelector((state) => state.wishlist);
  const compareState = useSelector((state) => state.compare);

  const wishlist = wishlistState.wishlist;
  const compare = compareState.compare;

  const isInWishlist = wishlist.some((product) => product.id === datas.id);
  const isInCompare = compare.some((product) => product.id === datas.id);

  // Open modal for QuickView
  const openModal = () => {
    setSelectedProduct(datas);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  // Add to cart handler
  const handleAddToCart = () => {
    dispatch(AddToCart(datas));
    dispatch(MakeIsInCartTrue(datas.id));
    message.success(`"${datas.name}" đã thêm vào giỏ hàng`);
  };

  // Add to wishlist handler
  const handleAddToWishlist = () => {
    dispatch(AddToWishlist(datas));
    dispatch(MakeIsInWishlistTrueInWishlist(datas.id));
    message.success(`"${datas.name}" đã thêm vào danh sách yêu thích`);
  };

  // Add to compare handler
  const handleAddToCompare = () => {
    dispatch(AddToCompare(datas));
    dispatch(MakeIsInCompareTrueInCompare(datas.id));
    message.success(`"${datas.name}" đã thêm vào danh sách so sánh`);
  };

  return (
    <>
      <div
        data-aos="fade-left"
        className={`product-row-card w-full h-[250px] bg-white group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out ${className || ""
          }`}
      >
        <div className="flex space-x-5 items-center w-full h-full p-4">
          <div className="w-1/3 h-full">
            <img
              src={datas?.images[0]}
              alt={datas.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center h-full space-y-2">
            <Link to={`/single-product/${datas.id}`}>
              <p className="title mb-1 text-sm font-semibold text-gray-800 leading-tight line-clamp-2 hover:text-blue-600">
                {datas.name}
              </p>
            </Link>

            {/* Rating Section */}
            <div className="flex items-center mb-1">
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

            {/* Price Section */}
            <div className="price flex items-center">
              {datas.sale ? (
                <>
                  <span className="main-price text-gray-500 line-through text-sm mr-2">
                    {datas.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                  <span className="offer-price text-red-500 text-lg font-bold">
                    {datas.salePrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </>
              ) : (
                <span className="main-price text-green-600 text-lg font-bold">
                  {datas.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
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
        </div>

        {/* Quick Access Buttons */}
        <div className="quick-access-btns flex flex-col space-y-2 absolute group-hover:right-4 -right-10 top-10 transition-all duration-300 ease-in-out">
          <a href="#!" onClick={openModal}>
            <span className="w-10 h-10 flex justify-center items-center bg-gray-200 hover:bg-gray-300 rounded-full">
              <QuickViewIco />
            </span>
          </a>
          <a
            href="#!"
            onClick={!isInWishlist ? handleAddToWishlist : undefined}
          >
            <span
              className={`w-10 h-10 flex justify-center items-center rounded-full ${isInWishlist ? "bg-yellow-500" : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              <ThinLove />
            </span>
          </a>
          <a href="#!" onClick={!isInCompare ? handleAddToCompare : undefined}>
            <span
              className={`w-10 h-10 flex justify-center items-center rounded-full ${isInCompare ? "bg-yellow-500" : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              <Compair />
            </span>
          </a>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedProduct={selectedProduct}
      />
    </>
  );
}
