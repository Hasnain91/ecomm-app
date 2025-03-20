import React, { useContext, useEffect } from "react";
import axios from "axios";
// import { ShopContext } from "../context/ShopContext";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { baseUrl } from "../constants";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const { token, setCartItems, backendUrl } = useContext(ShopContext);
  const token = useSelector((state) => state.auth.token);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      if (!token) {
        navigate("/login");
        toast.error("Please log in to verify your payment.");
        return null;
      }

      const res = await axios.post(
        `${baseUrl}/api/order/verify-stripe`,
        {
          success,
          orderId,
        },
        { headers: { token } }
      );

      if (res.data.success) {
        // setCartItems({});
        dispatch({ type: "cart/clearCart" });
        navigate("/orders");
        toast.success("Payment verified successfully!");
      } else {
        navigate("/cart");
        toast.error("Payment verification failed. Please try again.");
      }
    } catch (error) {
      console.log("Error verifying payment:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return <div></div>;
};

export default Verify;
