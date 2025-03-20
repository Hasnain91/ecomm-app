import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
import { useSelector, useDispatch } from "react-redux";
import { assets } from "../constants/index";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // const { search, setSearch, showSearch, setShowSearch } =
  //   useContext(ShopContext);

  const search = useSelector((state) => state.search.search);
  const showSearch = useSelector((state) => state.search.showSearch);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-100 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 py-2 px-5 my-5 mx-3 rounded-full w-3/4 sm:w-1/2  ">
        <input
          value={search}
          onChange={(e) =>
            dispatch({ type: "search/setSearch", payload: e.target.value })
          }
          type="text"
          placeholder="Search"
          className="flex-1 outline-none bg-inherit"
        />
        <img src={assets.search_icon} alt="Search Icon" className="w-5" />
      </div>
      <img
        onClick={() =>
          dispatch({ type: "search/setShowSearch", payload: false })
        }
        className="inline w-3 cursor-pointer"
        src={assets?.cross_icon}
        alt="Cross Icon"
      />
    </div>
  ) : null;
};

export default SearchBar;
