import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import wishlistReducer from "./wishlistReducer";
import compareReducer from "./compareReducer";
import userReducer from "./userReducer";

const reducers = combineReducers({
  user: userReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  compare: compareReducer,
});

export default reducers;
