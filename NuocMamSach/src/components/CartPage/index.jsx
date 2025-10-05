import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { message, Input, Button } from "antd";
import BreadcrumbCom from "../BreadcrumbCom";
import EmptyCardError from "../EmptyCardError";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import ProductsTable from "./ProductsTable";
import { formatCurrency } from "../../utils/formatCurrency";
import { getVoucherByCode } from "../../api/voucherApi";
import { applyVoucher } from "../../redux/actions/cartActions";

export default function CardPage({ cart = true }) {
  const cartItems = useSelector((state) => state.cart.cart);
  const voucher = useSelector((state) => state.cart.voucher);
  const isLogin = useSelector((state) => state.user.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [discountCode, setDiscountCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Tính tổng số tiền trước và sau khi giảm giá
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      // Lấy giá của biến thể nếu có, nếu không lấy giá sản phẩm
      const itemPrice = item.variation
        ? item.variation.price
        : item.salePrice || item.price;

      return acc + itemPrice * item.count;
    }, 0);

    if (voucher && voucher.discountValue) {
      setDiscountValue(voucher.discountValue);
    }

    const discountedTotal =
      discountValue <= 100
        ? total - (total * discountValue) / 100
        : total - discountValue;

    setTotalAmount(discountedTotal > 0 ? discountedTotal : 0);
  }, [cartItems, discountValue, voucher]);

  const handleApplyDiscount = async () => {
    try {
      const voucher = await getVoucherByCode(discountCode);
      if (voucher && voucher.active) {
        setDiscountValue(voucher.discountValue);
        dispatch(applyVoucher(voucher));
        message.success(`Áp dụng mã giảm giá ${voucher.code} thành công!`);
      } else {
        message.error("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
      }
    } catch (error) {
      message.error("Không tìm thấy mã giảm giá hoặc mã đã hết hạn!");
    }
  };

  const handleCheckout = () => {
    if (!isLogin) {
      message.warning("Vui lòng đăng nhập trước khi tiếp tục thanh toán!");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <Layout childrenClasses={cart ? "pt-0 pb-0" : ""}>
      {cartItems.length === 0 ? (
        <div className="cart-page-wrapper w-full">
          <div className="container-x mx-auto">
            <EmptyCardError />
          </div>
        </div>
      ) : (
        <div className="cart-page-wrapper w-full bg-white pb-[60px]">
          <div className="w-full">
            <PageTitle
              title="Giỏ hàng của bạn"
              breadcrumb={[
                { name: "Trang chủ", path: "/" },
                { name: "Giỏ hàng", path: "/cart" },
              ]}
            />
          </div>
          <div className="w-full mt-[23px]">
            <div className="container-x mx-auto">
              <ProductsTable className="mb-[30px]" cartItems={cartItems} />
              <div className="w-full sm:flex justify-between">
                <div className="discount-code sm:w-[270px] w-full mb-5 sm:mb-0 h-[50px] flex">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <Button
                    type="primary"
                    className="ml-2 h-full w-[120px]"
                    onClick={handleApplyDiscount}
                  >
                    Áp dụng
                  </Button>
                </div>
                <div className="flex space-x-2.5 items-center">
                  <Link to="/">
                    <div className="w-[220px] h-[50px] bg-[#F6F6F6] flex justify-center items-center">
                      <span className="text-sm font-semibold">
                        Tiếp tục mua sắm
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="w-full mt-[30px] flex sm:justify-end">
                <div className="sm:w-[370px] w-full border border-[#EDEDED] px-[30px] py-[26px]">
                  <div className="sub-total mb-6">
                    <div className="flex justify-between mb-6">
                      <p className="text-[15px] font-medium text-qblack">
                        Tạm tính
                      </p>
                      <p className="text-[15px] font-medium text-qred">
                        {formatCurrency(
                          cartItems.reduce((acc, item) => {
                            const itemPrice = item.variation
                              ? item.variation.price
                              : item.salePrice || item.price;
                            return acc + itemPrice * item.count;
                          }, 0)
                        )}
                      </p>
                    </div>
                    <div className="w-full h-[1px] bg-[#EDEDED]"></div>
                  </div>

                  {discountValue > 0 && (
                    <div className="discount mb-6">
                      <div className="flex justify-between">
                        <p className="text-[15px] font-medium text-qblack">
                          Giảm giá (
                          {discountValue <= 100
                            ? `${discountValue}%`
                            : formatCurrency(discountValue)}
                          )
                        </p>
                        <p className="text-[15px] font-medium text-qred">
                          -
                          {formatCurrency(
                            discountValue <= 100
                              ? (cartItems.reduce((acc, item) => {
                                const itemPrice = item.variation
                                  ? item.variation.price
                                  : item.salePrice || item.price;
                                return acc + itemPrice * item.count;
                              }, 0) *
                                discountValue) /
                              100
                              : discountValue
                          )}
                        </p>
                      </div>
                      <div className="w-full h-[1px] bg-[#EDEDED]"></div>
                    </div>
                  )}

                  <div className="total mb-6">
                    <div className=" flex justify-between">
                      <p className="text-[18px] font-medium text-qblack">
                        Tổng cộng
                      </p>
                      <p className="text-[18px] font-medium text-qred">
                        {formatCurrency(totalAmount)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full h-[50px] black-btn flex justify-center items-center"
                    onClick={handleCheckout}
                  >
                    <span className="text-sm font-semibold">Thanh toán</span>
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
