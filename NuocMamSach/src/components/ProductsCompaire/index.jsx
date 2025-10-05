import Star from "../Helpers/icons/Star";
import { ShoppingCartOutlined } from "@ant-design/icons";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import { useSelector, useDispatch } from "react-redux";
import { RemoveFromCompare } from "../../redux/actions/compareActions";
import { AddToCart, MakeIsInCartTrue } from "../../redux/actions/cartActions";
import { message } from "antd";
import { useEffect } from "react";

export default function SoSanhSanPham() {
  // Get compare list from Redux store
  const productsToCompare = useSelector((state) => state.compare.compare);
  const dispatch = useDispatch();

  // Function to remove product from comparison
  const handleRemoveFromCompare = (id, name) => {
    dispatch(RemoveFromCompare(id));
    message.success(`Đã xóa ${name} khỏi so sánh.`);
  };

  // Function to add product to cart
  const handleAddToCart = (product) => {
    dispatch(AddToCart(product));
    dispatch(MakeIsInCartTrue(product.id));
    message.success(`"${product.name}" đã được thêm vào giỏ hàng.`);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="products-compare-wrapper w-full bg-white pb-[40px]">
        <div className="w-full mb-5">
          <PageTitle
            breadcrumb={[
              { name: "Trang chủ", path: "/" },
              { name: "So sánh sản phẩm", path: "/so-sanh-san-pham" },
            ]}
            title="So sánh sản phẩm"
          />
        </div>

        <div className="container-x mx-auto">
          <div className="w-full border border-gray-300 rounded-lg shadow-sm">
            <table className="table-wrapper w-full text-center">
              <tbody>
                <tr className="table-row-wrapper">
                  <td className="w-[233px] pt-[30px] px-[26px] align-top bg-gray-100 rounded-tl-lg">
                    <div>
                      <h1 className="text-[18px] font-medium text-gray-800 mb-4">
                        So sánh sản phẩm
                      </h1>
                      <p className="text-[13px] text-gray-500">
                        Chọn sản phẩm để xem sự khác biệt và điểm chung giữa
                        chúng
                      </p>
                    </div>
                  </td>

                  {productsToCompare.map((product) => (
                    <td
                      key={product.id}
                      className="product w-[235px] bg-white p-6 border-b border-r border-gray-300 relative"
                    >
                      {/* Remove Button */}
                      <span
                        onClick={() =>
                          handleRemoveFromCompare(product.id, product.name)
                        }
                        className="absolute top-2 right-2 cursor-pointer text-red-500 hover:text-red-700"
                      >
                        X
                      </span>

                      {/* Product Image */}
                      <div className="product-img flex justify-center mb-3">
                        <div className="w-[161px] h-[161px]">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      </div>

                      {/* Product Name */}
                      <p className="text-center text-[15px] font-medium text-gray-800 mb-2">
                        {product.name}
                      </p>

                      {/* Price */}
                      <p className="text-center text-[15px] font-medium text-red-600 mb-3">
                        {product.salePrice.toLocaleString("vi-VN")}₫
                      </p>

                      {/* Rating Section */}
                      <div className="flex justify-center mb-3">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 ${index < product.averageRating
                                ? "text-yellow-400"
                                : "text-gray-300"
                              }`}
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-500">
                          ({product.reviews.length} đánh giá)
                        </span>
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
                    </td>
                  ))}
                </tr>

                {/* Message if no products to compare */}
                {productsToCompare.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                      Không có sản phẩm nào để so sánh.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
