import InputQuantityCom from "../Helpers/InputQuantityCom";
import { formatCurrency } from "../../utils/formatCurrency";
import { useDispatch } from "react-redux";
import {
  IncreaseProductCount,
  DecreaseProductCount,
  DeleteFromCart,
} from "../../redux/actions/cartActions";
import { message } from "antd";

export default function ProductsTable({ className, cartItems }) {
  const dispatch = useDispatch();

  const handleDelete = (item) => {
    message.warning(`Đã xóa ${item.name} khỏi giỏ hàng`);
    dispatch(DeleteFromCart(item));
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="relative w-full overflow-x-auto border border-[#EDEDED]">
        <table className="w-full text-sm text-left text-qblack dark:text-gray-400">
          <tbody>
            {/* table heading */}
            <tr className="text-[13px] font-medium text-black bg-[#F6F6F6] whitespace-nowrap px-2 border-b default-border-bottom uppercase">
              <td className="py-4 pl-10 block whitespace-nowrap min-w-[300px]">
                Sản phẩm
              </td>
              <td className="py-4 whitespace-nowrap text-center">Giá</td>
              <td className="py-4 whitespace-nowrap  text-center">Số lượng</td>
              <td className="py-4 whitespace-nowrap  text-center">Tổng</td>
              <td className="py-4 whitespace-nowrap text-right w-[114px]"></td>
            </tr>
            {/* table heading end */}
            {cartItems.map((item) => {
              // Lấy giá của biến thể nếu có, nếu không lấy giá sản phẩm
              const itemPrice = item.variation
                ? item.variation.price
                : item.salePrice || item.price;

              return (
                <tr key={item.uniqueKey} className="bg-white border-b hover:bg-gray-50">
                  <td className="pl-10 py-4 w-[380px]">
                    <div className="flex space-x-6 items-center">
                      <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center border border-[#EDEDED]">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <p className="font-medium text-[15px] text-qblack">
                          {item.name}{" "}
                          {item.variation && (
                            <span className="text-[13px] text-gray-500 ml-2">
                              ({item.variation.name})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="text-center py-4 px-2">
                    <div className="flex flex-col space-x-1 items-center justify-center">
                      <span className="text-[15px] font-normal text-qblack">
                        {formatCurrency(itemPrice)}
                      </span>
                    </div>
                  </td>

                  <td className="py-4">
                    <div className="flex justify-center items-center">
                      <InputQuantityCom
                        count={item.count}
                        onIncrement={() =>
                          dispatch(IncreaseProductCount(item))
                        }
                        onDecrement={() =>
                          dispatch(DecreaseProductCount(item))
                        }
                      />
                    </div>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex space-x-1 items-center justify-center">
                      <span className="text-[15px] font-normal text-qblack">
                        {formatCurrency(itemPrice * item.count)}
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex space-x-1 items-center justify-center">
                      <button onClick={() => handleDelete(item)}>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.7 0.3C9.3 -0.1 8.7 -0.1 8.3 0.3L5 3.6L1.7 0.3C1.3 -0.1 0.7 -0.1 0.3 0.3C-0.1 0.7 -0.1 1.3 0.3 1.7L3.6 5L0.3 8.3C-0.1 8.7 -0.1 9.3 0.3 9.7C0.7 10.1 1.3 10.1 1.7 9.7L5 6.4L8.3 9.7C8.7 10.1 9.3 10.1 9.7 9.7C10.1 9.3 10.1 8.7 9.7 8.3L6.4 5L9.7 1.7C10.1 1.3 10.1 0.7 9.7 0.3Z"
                            fill="#AAAAAA"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
