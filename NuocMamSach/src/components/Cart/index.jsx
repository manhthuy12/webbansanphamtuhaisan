import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "../../utils/formatCurrency";
import { DeleteFromCart } from "../../redux/actions/cartActions";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";

export default function Cart({ className, type }) {
  const cart = useSelector((state) => state.cart.cart);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveFromCart = (item) => {
    message.warning(`Đã xóa ${item.name} khỏi giỏ hàng`);
    dispatch(DeleteFromCart(item));
  };

  const handleCheckout = () => {
    if (!userInfo) {
      message.warning("Vui lòng đăng nhập trước khi tiếp tục thanh toán!");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div
      style={{ boxShadow: "0px 15px 50px 0px rgba(0, 0, 0, 0.14)" }}
      className={`w-[350px] bg-white border-t-[3px] ${type === 3 ? "border-qh3-blue" : "cart-wrapper"
        } ${className || ""}`}
    >
      <div className="w-full h-full">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <ShoppingCartOutlined style={{ fontSize: "48px", color: "#AAAAAA" }} />
            <p className="text-qgray mt-4">Giỏ hàng của bạn trống</p>
          </div>
        ) : (
          <>
            <div className="product-items h-[310px] overflow-y-scroll">
              <ul>
                {cart.map((item) => {
                  const itemPrice = item.variation
                    ? item.variation.price
                    : item.salePrice || item.price;

                  return (
                    <li
                      key={`${item.id}-${item.variation?.name || "default"}`}
                      className="w-full flex items-start py-[10px]"
                    >
                      <div className="flex space-x-[6px] justify-center items-center px-4 w-full">
                        <div className="w-[65px]">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-[65px] h-[65px] object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="title mb-2 text-[13px] font-600 text-qblack leading-4 line-clamp-2 hover:text-blue-600">
                            {item.name}
                          </p>
                          {item.variation && (
                            <p className="text-xs text-qgray">
                              Lựa chọn: {item.variation.name}
                            </p>
                          )}
                          <p className="price">
                            <span className="offer-price text-qred font-600 text-[15px] ml-2">
                              {formatCurrency(itemPrice)} x {item.count}
                            </span>
                          </p>
                        </div>
                        <span
                          className="mt-[20px] mr-[15px] inline-flex cursor-pointer"
                          onClick={() => handleRemoveFromCart(item)}
                        >
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 8 8"
                            fill="none"
                            className="inline fill-current text-[#AAAAAA] hover:text-qred"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7.76 0.24C7.44 -0.08 6.96 -0.08 6.64 0.24L4 2.88L1.36 0.24C1.04 -0.08 0.56 -0.08 0.24 0.24C-0.08 0.56 -0.08 1.04 0.24 1.36L2.88 4L0.24 6.64C-0.08 6.96 -0.08 7.44 0.24 7.76C0.56 8.08 1.04 8.08 1.36 7.76L4 5.12L6.64 7.76C6.96 8.08 7.44 8.08 7.76 7.76C8.08 7.44 8.08 6.96 7.76 6.64L5.12 4L7.76 1.36C8.08 1.04 8.08 0.56 7.76 0.24Z" />
                          </svg>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="w-full px-4 mt-[20px] mb-[12px]">
              <div className="h-[1px] bg-[#F0F1F3]"></div>
            </div>

            <div className="product-actions px-4 mb-[30px]">
              <div className="total-equation flex justify-between items-center mb-[28px]">
                <span className="text-[15px] font-500 text-qblack">Tổng phụ</span>
                <span className="text-[15px] font-500 text-qred ">
                  {formatCurrency(
                    cart.reduce(
                      (total, item) =>
                        total +
                        (item.variation
                          ? item.variation.price
                          : item.salePrice || item.price) *
                        item.count,
                      0
                    )
                  )}
                </span>
              </div>
              <div className="product-action-btn">
                <a href="#">
                  <div
                    onClick={() => navigate("/cart")}
                    className="gray-btn w-full h-[50px] mb-[10px]"
                  >
                    <span>Xem giỏ hàng</span>
                  </div>
                </a>
                <a href="#">
                  <div className="w-full h-[50px]">
                    <div
                      onClick={handleCheckout}
                      className={type === 3 ? "blue-btn" : "yellow-btn"}
                    >
                      <span className="text-sm">Thanh toán ngay</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
