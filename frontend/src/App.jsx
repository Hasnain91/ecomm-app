import { Routes, Route } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Verify from "./pages/Verify";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "./redux/features/authSlice";
import { backendUrl } from "../../admin/src/constants";
import { fetchProducts } from "./redux/features/productSlice";

import io from "socket.io-client";
import { useContext, useEffect } from "react";
import { ShopContext } from "./context/ShopContext";

const socket = io(backendUrl);

const App = () => {
  // const { token, setToken, user } = useContext(ShopContext);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  // useEffect(() => {
  //   if (user?._id) {
  //     socket.emit("join", user._id); // ✅ Join user's own room

  //     socket.on("forceLogout", (data) => {
  //       alert(data.message);
  //       setToken(null);
  //       localStorage.removeItem("token");
  //       window.location.href = "/login"; // ✅ Redirect to login page
  //       toast.success("yesSs" + data?.message);
  //     });
  //   }
  useEffect(() => {
    if (user?._id) {
      // Join the user's room
      socket.emit("join", user._id);

      // Listen for force logout events
      socket.on("forceLogout", (data) => {
        alert(data.message);
        dispatch(clearAuth()); // Clear auth state in Redux
        window.location.href = "/login"; // Redirect to login page
        toast.success(data?.message);
      });
    }

    return () => {
      socket.off("forceLogout");
    };
  }, [user?._id]);

  useEffect(() => {
    dispatch(fetchProducts()); // Fetch products on app load
  }, [dispatch]);
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "20px",
            borderRadius: "100px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
