import { ActionType } from "./actionTypes";

export const AddToCompare = (product) => {
  return {
    type: ActionType.ADD_TO_COMPARE,
    payload: product,
  };
};

export const MakeIsInCompareTrueInCompare = (id) => {
  return {
    type: ActionType.MAKE_IS_IN_COMPARE_TRUE_IN_COMPARE,
    payload: id,
  };
};

export const CompareProductIsInCartFalse = (id) => {
  return {
    type: ActionType.MAKE_COMPARE_PRODUCT_ISINCART_FALSE,
    payload: id,
  };
};

export const RemoveFromCompare = (id) => {
  return {
    type: ActionType.REMOVE_FROM_COMPARE,
    payload: id,
  };
};
