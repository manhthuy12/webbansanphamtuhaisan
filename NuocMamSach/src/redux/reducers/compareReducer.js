import { message } from "antd";
import { ActionType } from "../actions/actionTypes";

const initialState = {
  compare: [],
};

const compareReducer = (state = initialState, action) => {
  switch (action.type) {
    // thêm sản phẩm vào so sánh
    case ActionType.ADD_TO_COMPARE:
      // Kiểm tra nếu có 4 sản phẩm trong danh sách so sánh
      if (state.compare.length >= 4) {
        message.warning("Bạn chỉ có thể so sánh tối đa 4 sản phẩm.");
        return; // Không thay đổi state
      }
      // Nếu chưa đạt giới hạn, thêm sản phẩm vào danh sách so sánh
      return {
        ...state,
        compare: [...state.compare, action.payload],
      };

    // xóa sản phẩm khỏi so sánh
    case ActionType.REMOVE_FROM_COMPARE:
      return {
        ...state,
        compare: state.compare.filter(
          (product) => product.id !== action.payload
        ),
      };

    // đặt isInCompare của sản phẩm thành true trong so sánh
    case ActionType.MAKE_IS_IN_COMPARE_TRUE_IN_COMPARE:
      return {
        ...state,
        compare: state.compare.map((product) =>
          product.id === action.payload
            ? { ...product, isInCompare: true }
            : product
        ),
      };

    // đặt isInCart của sản phẩm trong so sánh thành false
    case ActionType.MAKE_COMPARE_PRODUCT_ISINCART_FALSE:
      return {
        ...state,
        compare: state.compare.map((product) =>
          product.id === action.payload
            ? { ...product, isInCart: false }
            : product
        ),
      };

    default:
      return state;
  }
};

export default compareReducer;
