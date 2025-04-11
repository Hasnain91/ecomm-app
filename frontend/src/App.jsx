import { Routes, Route, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import io from "socket.io-client";
import { useEffect } from "react";

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

// Experimenting with animations
import AOS from "aos";
import "aos/dist/aos.css";

const socket = io(backendUrl);

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Experimenting with animations
  useEffect(() => {
    AOS.init({
      duration: "1000",
      once: false,
    });
  }, []);

  useEffect(() => {
    if (!user) {
      // console.log("⏳ Waiting for user data...");
      return;
    }
    if (user) {
      // Join the user's room
      socket.emit("join", user);

      // Listen for force logout events
      socket.on("forceLogout", (data) => {
        toast.error("You have been logged out, please contact admin");

        dispatch(clearAuth());
        // window.location.href = "/login";
        navigate("/login");
        toast.success(data?.message);
      });
    }

    return () => {
      socket.off("forceLogout");
    };
  }, [user]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "18px",
            fontWeight: "normal",
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
