import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants/index";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = baseUrl;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const addToCart = async (productId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[productId]) {
      if (cartData[productId][size]) {
        cartData[productId][size] += 1;
      } else {
        cartData[productId][size] = 1;
      }
    } else {
      cartData[productId] = {};
      cartData[productId][size] = 1;
    }

    setCartItems(cartData);
    toast.success("Product added to the cart");

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          {
            productId,
            size,
          },
          { headers: { token } }
        );
      } catch (error) {
        console.log("error in addToCart function in ShopContext: ", error);
        toast.error(error?.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          try {
            totalCount += cartItems[items][item];
          } catch (error) {
            console.log("Error in getCartCount: ", error);
          }
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          {
            itemId,
            size,
            quantity,
          },
          { headers: { token } }
        );
      } catch (error) {
        console.log("Error in updateQuantity: ", error);
        toast.error(error?.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);

      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log("error in getCartAmount: ", error);
        }
      }
    }

    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);

      if (res.data.success) {
        setProducts(res?.data?.products);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log("Error in getting Products Data: ", error);
      toast.error(error?.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        setCartItems(res.data.cartData);
      }
    } catch (error) {
      console.log("Error in getUserCart: ", error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
