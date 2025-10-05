import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import InputCom from "../Helpers/InputCom";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import { getAddressBooksByUserId } from "../../api/addressBookApi";
import { createOrder } from "../../api/orderApi";
import { Modal, message } from "antd";
import { ClearCart, ClearVoucher } from "../../redux/actions/cartActions";
import { formatCurrency } from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createVNPayPayment } from "../../api/vnpayApi";

export default function CheckoutPage() {
  const voucher = useSelector((state) => state.cart.voucher);
  const cart = useSelector((state) => state.cart.cart);
  const userInfo = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [discount, setDiscount] = useState(0);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("VNPay");

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const exchangeRate = 24000;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (voucher) {
      if (new Date(voucher.endDate) >= new Date() && voucher.active) {
        setDiscount(voucher.discountValue);
      } else {
        setDiscount(0);
        navigate("/cart#");
        dispatch(ClearVoucher());
        message.warning("Voucher đã hết hạn hoặc không hợp lệ.");
      }
    } else {
      setDiscount(0);
    }
  }, [voucher]);

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchAddressBooks(userInfo.id);
    }
  }, [userInfo]);

  const fetchAddressBooks = async (userId) => {
    try {
      const addressData = await getAddressBooksByUserId(userId);
      if (!addressData || addressData.length === 0) {
        Modal.warning({
          title: "Chưa có địa chỉ nhận hàng",
          content: "Vui lòng thêm địa chỉ nhận hàng.",
          onOk() {
            navigate(`/profile#address`);
          },
        });
      } else {
        const defaultAddr = addressData.find((address) => address.default);
        setDefaultAddress(defaultAddr);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách địa chỉ");
      console.error("Error fetching address books:", error);
    }
  };

  // 🔹 Tính tổng tiền dựa trên giá sản phẩm hoặc biến thể
  const totalAmount = cart.reduce((acc, item) => {
    const itemPrice = item.variation ? item.variation.price : item.salePrice || item.price;
    return acc + itemPrice * item.count;
  }, 0);

  // 🔹 Tính tổng tiền sau khi áp dụng giảm giá
  const finalAmount = discount <= 100 ? totalAmount * (1 - discount / 100) : Math.max(0, totalAmount - discount);
  
  // 🔹 Chuyển đổi sang USD cho PayPal
  const finalAmountUSD = (finalAmount / exchangeRate).toFixed(2);

  const handleVNPayPayment = async () => {
    try {
      const orderInfo = "Thanh toán đơn hàng";
      const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || "";

      const response = await createVNPayPayment(finalAmount, orderInfo, VITE_PUBLIC_URL);
      if (response) {
        localStorage.setItem("addressBookId", defaultAddress.addressBookId);
        window.location.href = response;
      } else {
        message.error("Lỗi tạo thanh toán VNPay");
      }
    } catch (error) {
      console.error("Error creating VNPay payment:", error);
      message.error("Lỗi khi tạo thanh toán VNPay.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!defaultAddress) {
      message.error("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    try {
      const orderItems = cart.map((item) => ({
        product: { id: item.id },
        quantity: item.count,
        variant: item.variation ? { id: item.variation.id } : null,
        priceAtPurchase: item.variation ? item.variation.price : item.salePrice || item.price,
      }));

      const paid = paymentMethod === "VNPay" || paymentMethod === "Paypal";

      const response = await createOrder(
        userInfo.id,
        finalAmount,
        paymentMethod,
        paid,
        orderItems,
        defaultAddress.addressBookId,
        voucher ? voucher.code : ""
      );

      message.success("Đơn hàng đã được tạo thành công!");

      dispatch(ClearCart());
      dispatch(ClearVoucher());
      navigate(`/checkoutsuccess?orderId=${response.id}`);
    } catch (error) {
      message.error("Lỗi khi tạo đơn hàng. Vui lòng thử lại sau.");
      console.error("Error creating order:", error);
    }
  };
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="checkout-page-wrapper w-full bg-white pb-[60px]">
        <div className="w-full mb-5">
          <PageTitle
            title="Thanh Toán"
            breadcrumb={[
              { name: "Trang Chủ", path: "/" },
              { name: "Thanh Toán", path: "/checkout" },
            ]}
          />
        </div>
        <div className="checkout-main-content w-full">
          <div className="container-x mx-auto">
            <div className="w-full lg:flex lg:space-x-[30px]">
              <div className="lg:w-1/2 w-full">
                <h1 className="sm:text-2xl text-xl text-qblack font-medium mb-5">
                  Chi Tiết Hóa Đơn
                </h1>
                <div className="form-area">
                  <form>
                    <div className="flex space-x-5 items-center mb-6">
                      <div className="w-1/2">
                        <InputCom
                          label="Họ Tên*"
                          placeholder={defaultAddress?.recipientName || "Tên"}
                          value={defaultAddress?.recipientName}
                          inputClasses="w-full h-[50px]"
                          readOnly
                        />
                      </div>
                      <div className="flex-1">
                        <InputCom
                          label="Số điện thoại*"
                          placeholder={
                            defaultAddress?.phoneNumber ||
                            "Số điện thoại của bạn"
                          }
                          value={defaultAddress?.phoneNumber || ""}
                          inputClasses="w-full h-[50px]"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex space-x-5 items-center mb-6">
                      <div className="w-1/2">
                        <InputCom
                          label="Tỉnh/Thành Phố*"
                          placeholder={defaultAddress?.city || "Tỉnh/Thành Phố"}
                          value={defaultAddress?.city || ""}
                          inputClasses="w-full h-[50px]"
                          readOnly
                        />
                      </div>
                      <div className="flex-1">
                        <InputCom
                          label="Quận/Huyện*"
                          placeholder={defaultAddress?.district || "Quận/Huyện"}
                          value={defaultAddress?.district || ""}
                          inputClasses="w-full h-[50px]"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex space-x-5 items-center mb-6">
                      <div className="w-1/2">
                        <InputCom
                          label="Phường/Xã*"
                          placeholder={defaultAddress?.ward || "Phường/Xã"}
                          value={defaultAddress?.ward || ""}
                          inputClasses="w-full h-[50px]"
                          readOnly
                        />
                      </div>
                      <div className="flex-1">
                        <InputCom
                          label="Địa chỉ*"
                          placeholder={defaultAddress?.address || "Địa chỉ"}
                          value={defaultAddress?.address || ""}
                          inputClasses="w-full h-[50px]"
                          readOnly
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="sm:text-2xl text-xl text-qblack font-medium mb-5">
                  Tóm tắt đơn hàng
                </h1>

                <div className="w-full px-10 py-[30px] border border-[#EDEDED]">
                  <div className="sub-total mb-6">
                    <div className="flex justify-between mb-5">
                      <p className="text-[13px] font-medium text-qblack uppercase">
                        Sản phẩm
                      </p>
                      <p className="text-[13px] font-medium text-qblack uppercase">
                        Tổng cộng
                      </p>
                    </div>
                    <div className="w-full h-[1px] bg-[#EDEDED]"></div>
                  </div>

                  <div className="product-list w-full mb-[30px]">
                    <ul className="flex flex-col space-y-5">
                      {cart.map((item, index) => (
                        <li key={index}>
                          <div className="flex justify-between items-center">
                            <div className="flex justify-between">
                              <h4 className="text-[15px] text-qblack mb-2.5">
                                {item.name}
                              </h4>
                              <p className="text-[13px] text-qgray ml-2">
                                x{item.count}
                              </p>
                            </div>
                            <div>
                              <span className="text-[15px] text-qblack font-medium">
                                {formatCurrency(
                                  (item.salePrice || item.price) * item.count
                                )}
                              </span>
                            </div>
                          </div>

                          {item.selectedAccessories?.length > 0 && (
                            <div className="ml-6 mt-2">
                              {item.selectedAccessories.map((accessory) => (
                                <p
                                  key={accessory.id}
                                  className="text-[13px] text-qgray"
                                >
                                  Phụ kiện: {accessory.name} x 1 +{" "}
                                  {formatCurrency(accessory.price * 1)}
                                </p>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="w-full h-[1px] bg-[#EDEDED]"></div>

                  <div className="mt-[30px]">
                    <div className="flex justify-between mb-5">
                      <p className="text-[13px] font-medium text-qblack uppercase">
                        Tạm tính
                      </p>
                      <p className="text-[15px] font-medium text-qblack uppercase">
                        {formatCurrency(totalAmount)}
                      </p>
                    </div>
                  </div>
                  {discount > 0 && (
                    <div className="mt-[30px]">
                      <div className="flex justify-between mb-5">
                        <p className="text-[13px] font-medium text-qblack uppercase">
                          {" "}
                          Giảm giá (
                          {discount <= 100
                            ? `${discount}%`
                            : formatCurrency(discount)}
                          )
                        </p>
                        <p className="text-[15px] font-medium text-qblack uppercase">
                          -
                          {formatCurrency(
                            discount <= 100
                              ? (cart.reduce((acc, item) => {
                                const accessoriesPrice =
                                  item.selectedAccessories?.reduce(
                                    (acc, accItem) =>
                                      acc + accItem.price * 1,
                                    0
                                  ) || 0;
                                return (
                                  acc +
                                  (item.salePrice || item.price) *
                                  item.count +
                                  accessoriesPrice
                                );
                              }, 0) *
                                discount) /
                              100
                              : discount
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-[30px]">
                    <div className="flex justify-between mb-5">
                      <p className="text-2xl font-medium text-qblack">
                        Tổng cộng
                      </p>
                      <p className="text-2xl font-medium text-qred">
                        {formatCurrency(finalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="shipping mt-[30px]">
                    <ul className="flex flex-col space-y-1">
                      <li>
                        <div className="flex space-x-2.5 items-center mb-4">
                          <div className="input-radio">
                            <input
                              type="radio"
                              name="paymentMethod"
                              className="accent-pink-500"
                              id="transfer"
                              onChange={() => setPaymentMethod("VNPay")}
                              checked={paymentMethod === "VNPay"}
                            />
                          </div>
                          <label
                            htmlFor="transfer"
                            className="text-[18px] text-normal text-qblack"
                          >
                            Chuyển khoản ngân hàng(VNPay)
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="flex space-x-2.5 items-center mb-5">
                          <div className="input-radio">
                            <input
                              type="radio"
                              name="paymentMethod"
                              className="accent-pink-500"
                              id="delivery"
                              onChange={() => setPaymentMethod("COD")}
                            />
                          </div>
                          <label
                            htmlFor="delivery"
                            className="text-[18px] text-normal text-qblack"
                          >
                            Thanh toán khi nhận hàng
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="flex space-x-2.5 items-center mb-5">
                          <div className="input-radio">
                            <input
                              type="radio"
                              name="paymentMethod"
                              className="accent-pink-500"
                              id="bank"
                              onChange={() => setPaymentMethod("Paypal")}
                            />
                          </div>
                          <label
                            htmlFor="bank"
                            className="text-[18px] text-normal text-qblack"
                          >
                            Thẻ tín dụng/ghi nợ hoặc Paypal
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                  {paymentMethod === "Paypal" && (
                    <PayPalScriptProvider options={{ clientId: clientId }}>
                      <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "USD",
                                  value: finalAmountUSD,
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          const details = await actions.order.capture();
                          message.success(`Thanh toán thành công!`);
                          handlePlaceOrder(); // Proceed with placing the order
                        }}
                        onError={(err) => {
                          console.error("Lỗi khi thanh toán PayPal:", err);
                          message.error("Lỗi khi thanh toán PayPal.");
                        }}
                      />
                    </PayPalScriptProvider>
                  )}
                  {paymentMethod !== "Paypal" && (
                    <a href="#">
                      <div
                        className="w-full h-[50px] black-btn flex justify-center items-center"
                        onClick={() => {
                          if (paymentMethod === "VNPay") {
                            handleVNPayPayment();
                          } else {
                            handlePlaceOrder();
                          }
                        }}
                      >
                        <span className="text-sm font-semibold">
                          Đặt hàng ngay
                        </span>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
