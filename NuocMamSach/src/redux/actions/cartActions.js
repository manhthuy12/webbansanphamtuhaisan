import { ActionType } from "./actionTypes";

export const AddToCart = (product) => {
  return {
    type: ActionType.ADD_TO_CART,
    payload: product,
  };
};

export const MakeIsInCartTrue = (id) => {
  return {
    type: ActionType.MAKE_ISINCART_TRUE,
    payload: id,
  };
};

export const DeleteFromCart = (id) => {
  return {
    type: ActionType.DELETE_FROM_CART,
    payload: id,
  };
};

export const ClearCart = () => {
  return {
    type: ActionType.CLEAR_CART,
  };
};

export const IncreaseProductCount = (id) => {
  return {
    type: ActionType.INCREASE_PRODUCT_COUNT,
    payload: id,
  };
};

export const DecreaseProductCount = (id) => {
  return {
    type: ActionType.DECREASE_PRODUCT_COUNT,
    payload: id,
  };
};

export const applyVoucher = (voucher) => {
  return {
    type: ActionType.APPLY_VOUCHER,
    payload: voucher,
  };
};


export const ClearVoucher = () => {
  return {
    type: ActionType.CLEAR_VOUCHER,
  };
};
