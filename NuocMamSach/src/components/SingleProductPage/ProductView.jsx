import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Star from "../Helpers/icons/Star";
import { formatCurrency } from "../../utils/formatCurrency";
import ThinLove from "../Helpers/icons/ThinLove";
import Compair from "../Helpers/icons/Compair";
import { AddToCart, MakeIsInCartTrue } from "../../redux/actions/cartActions";
import {
  AddToWishlist,
  MakeIsInWishlistTrueInWishlist,
} from "../../redux/actions/wishlistActions";
import {
  AddToCompare,
  MakeIsInCompareTrueInCompare,
} from "../../redux/actions/compareActions";
import { message } from "antd"; // Import message để hiển thị thông báo

export default function ProductView({ product }) {
  const dispatch = useDispatch();

  if (!product) {
    return null;
  }

  const {
    name,
    price,
    salePrice,
    sale,
    category,
    reviews,
    variants,
    averageRating,
    images,
  } = product;

  const [src, setSrc] = useState(
    images?.length > 0 ? images[0] : "placeholder.png"
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const cartState = useSelector((state) => state.cart);
  const wishlistState = useSelector((state) => state.wishlist);
  const compareState = useSelector((state) => state.compare);

  const cart = cartState.cart;
  const wishlist = wishlistState.wishlist;
  const compare = compareState.compare;

  const isInCart = cart.some((cartProduct) => cartProduct.id === product.id);
  const isInWishlist = wishlist.some(
    (wishlistProduct) => wishlistProduct.id === product.id
  );
  const isInCompare = compare.some(
    (compareProduct) => compareProduct.id === product.id
  );

  const changeImgHandler = (current) => {
    setSrc(current);
  };

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => quantity > 1 && setQuantity((prev) => prev - 1);

  const handleVariantSelection = (variant) => {
    if (variant.quantity > 0) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = () => {
    let productToAdd;

    if (variants?.length > 0 && !selectedVariant) {
      message.warning("Vui lòng chọn một phiên bản sản phẩm trước!");
      return;
    }

    if (selectedVariant) {
      // Kiểm tra số lượng đặt không lớn hơn số lượng hiện có của biến thể
      if (quantity > selectedVariant.quantity) {
        message.warning(`Chỉ còn ${selectedVariant.quantity} sản phẩm có sẵn!`);
        return;
      }

      productToAdd = {
        id: product.id,
        name: product.name,
        category: product.category,
        images: product.images,
        salePrice: selectedVariant.price,
        count: quantity,
        variation: selectedVariant
      };
    } else {
      // Nếu không có variant, lấy giá sản phẩm chính
      productToAdd = {
        id: product.id,
        name: product.name,
        category: product.category,
        images: product.images,
        salePrice: salePrice || price,
        count: quantity,
        variation: null
      };
    }

    dispatch(AddToCart(productToAdd));
    dispatch(MakeIsInCartTrue(product.id));
    message.success(`${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ""} đã được thêm vào giỏ hàng!`);
  };


  return (
    <div className="product-view w-full lg:flex justify-between">
      <div className="lg:w-1/2 xl:mr-[70px] lg:mr-[50px]">
        <div className="w-full">
          <div className="w-full h-[600px] border border-qgray-border flex justify-center items-center overflow-hidden relative mb-3">
            <img src={src} alt={name} className="object-cover" />
            {product.sale && (
              <div className="w-[80px] h-[80px] rounded-full bg-qyellow text-qblack flex justify-center items-center text-xl font-medium absolute left-[30px] top-[30px]">
                <span>-{Math.round(((price - salePrice) / price) * 100)}%</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {images && images.length > 0 ? (
              images.map((img, index) => (
                <div
                  onClick={() => changeImgHandler(img)}
                  key={index}
                  className="w-[110px] h-[110px] p-[15px] border border-qgray-border cursor-pointer"
                >
                  <img
                    src={img}
                    alt="Sản phẩm"
                    className={`w-full h-full object-cover ${src !== img ? "opacity-50" : ""
                      }`}
                  />
                </div>
              ))
            ) : (
              <div>Không có hình ảnh</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="product-details w-full mt-10 lg:mt-0">
          <span className="text-qgray text-xs font-normal uppercase tracking-wider mb-2 inline-block">
            {category?.name || "Danh mục"}
          </span>
          <p className="text-xl font-medium text-qblack mb-4">{name}</p>

          <div className="flex space-x-[10px] items-center mb-6">
            <div className="flex">
              {[...Array(Math.round(averageRating || 0))].map((_, i) => (
                <Star key={i} />
              ))}
            </div>
            <span className="text-[13px] font-normal text-qblack">
              {reviews?.length || 0} Đánh giá
            </span>
          </div>

          <div className="flex space-x-2 items-center mb-7">
            {salePrice && (
              <span className="text-sm font-500 text-qgray line-through mt-2">
                {formatCurrency(price)}
              </span>
            )}
            <span className="text-2xl font-500 text-qred">
              {salePrice < price ? formatCurrency(salePrice) : formatCurrency(price)}
            </span>
          </div>

          {variants?.length > 0 && (
            <div className="variants mb-[30px]">
              <h3 className="text-lg font-semibold mb-5">Lựa chọn:</h3>
              <div className="flex flex-wrap gap-4">
                {variants.map((variant) => (
                  <div
                    key={variant.name}
                    className={`p-4 border cursor-pointer flex items-center space-x-4 rounded-lg relative ${selectedVariant?.name === variant.name
                      ? "border-yellow-500"
                      : "border-gray-300"
                      } ${variant.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleVariantSelection(variant)}
                  >
                    <p className="text-sm font-medium">{variant.name}</p>
                    <p className="text-sm">{formatCurrency(variant.price)}</p>
                    <p className="text-xs text-gray-600">SL: {variant.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="quantity-card-wrapper w-full flex items-center h-[50px] space-x-[10px] mb-[30px]">
            <div className="w-[120px] h-full px-[26px] flex items-center border border-qgray-border">
              <div className="flex justify-between items-center w-full">
                <button
                  onClick={decrement}
                  type="button"
                  className="text-base text-qgray"
                >
                  -
                </button>
                <span className="text-qblack">{quantity}</span>
                <button
                  onClick={increment}
                  type="button"
                  className="text-base text-qgray"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex-1 h-full flex space-x-3">
              {" "}
              {/* Thêm khoảng cách giữa các nút */}
              <button
                type="button"
                className={`black-btn text-sm font-semibold w-full h-[50px]`}
                onClick={handleAddToCart}
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>

          <div className="mb-[20px]">
            <p className="text-[13px] text-qgray leading-7">
              <span className="text-qblack">Danh mục :</span> {category?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
