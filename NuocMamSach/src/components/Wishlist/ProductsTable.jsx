import { useSelector, useDispatch } from "react-redux";
import InputQuantityCom from "../Helpers/InputQuantityCom";
import { formatCurrency } from "../../utils/formatCurrency";
import { RemoveFromWishlist } from "../../redux/actions/wishlistActions";
import { message } from "antd";

export default function ProductsTable({ className }) {
  // Lấy wishlist từ Redux store
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const dispatch = useDispatch();

  // Hàm xử lý xóa sản phẩm khỏi wishlist
  const handleRemoveFromWishlist = (item) => {
    message.warning(`Đã xóa ${item.name} khỏi yêu thích`);
    dispatch(RemoveFromWishlist(item.id));
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="relative w-full overflow-x-auto border border-[#EDEDED]">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>
            {/* table heading */}
            <tr className="text-[13px] font-medium text-black bg-[#F6F6F6] whitespace-nowrap px-2 border-b default-border-bottom uppercase">
              <td className="py-4 pl-10 block whitespace-nowrap w-[380px]">
                Sản phẩm
              </td>
              <td className="py-4 whitespace-nowrap text-center">
                Trạng thái kho
              </td>
              <td className="py-4 whitespace-nowrap text-center">Giá</td>
              <td className="py-4 whitespace-nowrap text-right w-[114px] block"></td>
            </tr>
            {/* table heading end */}

            {wishlist.map((item) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="pl-10 py-4">
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
                        {item.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-[15px] font-normal">
                    Còn hàng ({item.quantity})
                  </span>
                </td>
                <td className="text-center py-4 px-2">
                  <div className="flex space-x-1 items-center justify-center">
                    {item.salePrice < item.price ? (
                      <>
                        <span className="text-[15px] font-normal line-through text-gray-500">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="text-[15px] font-normal text-red-500">
                          {formatCurrency(item.salePrice)}
                        </span>
                      </>
                    ) : (
                      <span className="text-[15px] font-normal">
                        {formatCurrency(item.price)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-right py-4">
                  <div className="flex space-x-1 items-center justify-center">
                    <span
                      onClick={() => handleRemoveFromWishlist(item)}
                      className="cursor-pointer"
                    >
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
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
