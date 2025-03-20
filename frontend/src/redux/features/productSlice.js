import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../constants";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await axios.get(`${baseUrl}/api/product/list`);
    if (res.data.success) {
      // console.log(res.data);
      // console.log(
      //   "Is allProducts an array?",
      //   Array.isArray(res.data.allProducts)
      // );
      return res.data.allProducts;
    }
  }
);

fetchProducts();

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // console.log("List is being updated: " + action.payload);

        state.list = Array.isArray(action.payload) ? action.payload : [];
        // console.log("Is state.list an array?", Array.isArray(state.list));
        // console.log("Updated list: " + state.list);
        // console.log(typeof state.list);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
