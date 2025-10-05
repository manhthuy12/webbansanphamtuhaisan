import { ActionType } from "../actions/actionTypes";

const initialState = {
  cart: [],
  voucher: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // Thêm sản phẩm vào giỏ hàng
    case ActionType.ADD_TO_CART: {
      let alreadyExists = false;

      const updatedCart = state.cart.map((cartItem) => {
        if (
          cartItem.id === action.payload.id &&
          cartItem.variation?.name === action.payload.variation?.name
        ) {
          alreadyExists = true;
          return {
            ...cartItem,
            count: (cartItem.count || 0) + (action.payload.count || 1), // Đảm bảo count không null
          };
        }
        return cartItem;
      });

      if (!alreadyExists) {
        updatedCart.push({
          ...action.payload,
          count: action.payload.count || 1, // Đảm bảo count luôn có giá trị
          variation: action.payload.variation || null,
          uniqueKey: `${action.payload.id}-${action.payload.variation?.name || "default"}` // Key duy nhất
        });
      }

      return {
        ...state,
        cart: updatedCart,
      };
    }

    case ActionType.CLEAR_CART:
      return {
        ...state,
        cart: [],
      };
    case ActionType.MAKE_ISINCART_TRUE:
      return {
        ...state,
        cart: state.cart.map((product) =>
          product.id === action.payload
            ? { ...product, isInCart: true }
            : product
        ),
      };
    // Xóa sản phẩm khỏi giỏ hàng
    case ActionType.DELETE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            product.uniqueKey !== action.payload.uniqueKey // So sánh bằng key duy nhất
        ),
      };

    // Tăng số lượng sản phẩm trong giỏ hàng
    case ActionType.INCREASE_PRODUCT_COUNT:
      return {
        ...state,
        cart: state.cart.map((product) =>
          product.uniqueKey === action.payload.uniqueKey
            ? { ...product, count: product.count + 1 }
            : product
        ),
      };

    // Giảm số lượng sản phẩm trong giỏ hàng (không nhỏ hơn 1)
    case ActionType.DECREASE_PRODUCT_COUNT:
      return {
        ...state,
        cart: state.cart.map((product) =>
          product.uniqueKey === action.payload.uniqueKey
            ? { ...product, count: Math.max(1, product.count - 1) }
            : product
        ),
      };
    case ActionType.APPLY_VOUCHER:
      return {
        ...state,
        voucher: action.payload,
      };

    // Xóa voucher giảm giá
    case ActionType.CLEAR_VOUCHER:
      return {
        ...state,
        voucher: null,
      };
    default:
      return state;
  }
};

export default cartReducer;
