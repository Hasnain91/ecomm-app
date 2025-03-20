import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: "$", // Default currency
  deliveryFee: 10,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setDeliveryFee: (state, action) => {
      state.deliveryFee = action.payload;
    },
  },
});

export const { setCurrency, setDeliveryFee } = configSlice.actions;
export default configSlice.reducer;
