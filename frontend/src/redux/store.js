import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import productReducer from "./features/productSlice";
import authReducer from "./features/authSlice";
import searchReducer from "./features/searchSlice";
import configReducer from "./features/configSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    auth: authReducer,
    search: searchReducer,
    config: configReducer,
  },
});

export default store;
