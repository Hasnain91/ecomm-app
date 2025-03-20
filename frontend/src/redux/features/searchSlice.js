import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  showSearch: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setShowSearch: (state, action) => {
      state.showSearch = action.payload;
    },
  },
});

export const { setSearch, setShowSearch } = searchSlice.actions;
export default searchSlice.reducer;
