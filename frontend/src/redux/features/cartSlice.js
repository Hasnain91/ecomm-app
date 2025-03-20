import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cart")) || {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, size } = action.payload;

      if (!size) return;

      if (!state.cartItems[productId]) {
        state.cartItems[productId] = {};
      }

      state.cartItems[productId][size] =
        (state.cartItems[productId][size] || 0) + 1;

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      toast.success("Product added top the cart");
    },

    updateQuantity: (state, action) => {
      const { productId, size, quantity } = action.payload;

      if (quantity === 0) {
        delete state.cartItems[productId]?.[size];
        if (Object.keys(state.cartItems[productId]).length === 0) {
          delete state.cartItems[productId];
        }
      } else {
        state.cartItems[productId][size] = quantity;
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = {};
      // Save updated cart to localStorage
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, updateQuantity, clearCart } = cartSlice.actions;

export const getCartCount = (state) => {
  let totalCount = 0;
  for (const productId in state.cart.cartItems) {
    for (const size in state.cart.cartItems[productId]) {
      totalCount += state.cart.cartItems[productId][size];
    }
  }
  return totalCount;
};

// export const getCartAmount = (state, products) => {
//   let totalAmount = 0;

//   for (const productId in state.cart.cartItems) {
//     const product = products[productId];
//     if (!product) continue;

//     // for (const size in state.cart.cartItems[productId]) {
//     //   totalAmount += product.price * state.cart.cartItems[productId][size];
//     // }
//     for (const size in state.cart.cartItems[productId]) {
//       const quantity = state.cart.cartItems[productId][size];
//       totalAmount += product.price * quantity; // Add to the total amount
//     }
//   }

//   return totalAmount;
export const getCartAmount = (state, products) => {
  let totalAmount = 0;

  for (const productId in state.cart.cartItems) {
    // ✅ Find the product from the array
    const product = products.find((p) => p._id === productId);

    if (!product) continue; // Skip if product doesn't exist

    for (const size in state.cart.cartItems[productId]) {
      const quantity = state.cart.cartItems[productId][size];
      totalAmount += product.price * quantity;
    }
  }

  return totalAmount;
};

export default cartSlice.reducer;
