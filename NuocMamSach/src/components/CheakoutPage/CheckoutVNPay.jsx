import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { handleVNPayPaymentReturn } from "../../api/vnpayApi";
import { createOrder } from "../../api/orderApi";
import { useSelector, useDispatch } from "react-redux";
import { ClearCart, ClearVoucher } from "../../redux/actions/cartActions";

const CheckoutVNPay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartState = useSelector((state) => state.cart);
  const userInfo = useSelector((state) => state.user.userInfo);
  const voucher = useSelector((state) => state.cart.voucher);
  const cart = cartState.cart;
  const [discount, setDiscount] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // useRef to ensure handlePaymentSubmit is called only once
  const hasSubmittedPayment = useRef(false);

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
    const queryParams = new URLSearchParams(location.search);
    const requestParams = Object.fromEntries(queryParams.entries());

    // Check if payment has already been submitted
    if (!hasSubmittedPayment.current) {
      hasSubmittedPayment.current = true;

      handleVNPayPaymentReturn(requestParams)
        .then((result) => {
          if (result === "Giao dịch thành công!") {
            const orderCode = queryParams.get("vnp_OrderInfo") || "";
            handlePaymentSubmit("VNPay");
          } else {
            message.error(result);
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Error handling VNPay payment return:", error);
          message.error("Lỗi xử lý thanh toán VNPay.");
          navigate("/");
        });
    }
  }, [location]);

  const handlePaymentSubmit = async (method) => {
    const selectedAddressBookId = localStorage.getItem("addressBookId");
    console.log("Tạo order");
    if (!selectedAddressBookId) {
      throw new Error("Không tìm thấy địa chỉ giao hàng.");
    }

    const addressBookId = Number(selectedAddressBookId);
    if (isNaN(addressBookId)) {
      throw new Error("ID địa chỉ không hợp lệ.");
    }

    const totalAmount = cart.reduce((acc, item) => {
      const accessoriesPrice = item.selectedAccessories
        ? item.selectedAccessories.reduce(
            (acc, accItem) => acc + accItem.price * accItem.quantity,
            0
          )
        : 0;
      return (
        acc + (item.salePrice || item.price) * item.count + accessoriesPrice
      );
    }, 0);

    const finalAmount =
      discount <= 100
        ? totalAmount * (1 - discount / 100)
        : totalAmount - discount;

    try {
      const orderItems = cart.map((item) => ({
        product: { id: item.id },
        quantity: item.count,
        accessoryItems:
          item.selectedAccessories?.map((accessory) => ({
            accessory: { id: accessory.id },
            quantity: 1,
          })) || [],
      }));

      const paid = method === "VNPay";

      const response = await createOrder(
        userInfo.id,
        finalAmount,
        method,
        paid,
        orderItems,
        addressBookId,
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

  return <div>Đang xử lý thanh toán...</div>;
};

export default CheckoutVNPay;
